require "capybara/rspec"
require "selenium-webdriver"

# Selenium Manager sometimes grabs a chromedriver whose version doesn't
# match the portable Chrome for Testing build set up in this sandbox (see
# README's "Headless Chrome" section). A mismatched chromedriver/browser
# pair causes subtle input-event bugs under Selenium's W3C actions API —
# e.g. only the first character of a fill_in sticks — instead of a clean
# error, so pin the chromedriver whose version matches the running Chrome
# binary when one is already cached locally.
def matching_chromedriver_path
  chrome_path = ENV["PATH"].split(File::PATH_SEPARATOR)
    .map { |dir| File.join(dir, "chrome") }
    .find { |path| File.executable?(path) }
  return unless chrome_path

  version_output = `"#{chrome_path}" --version`.strip
  browser_version = version_output[/[\d.]+/]
  return unless browser_version

  drivers_root = File.expand_path("~/.cache/selenium/chromedriver/linux64")
  return unless Dir.exist?(drivers_root)

  candidates = Dir.children(drivers_root)
  exact_or_closest = candidates.find { |v| v == browser_version } ||
    candidates.find { |v| v.split(".").first == browser_version.split(".").first }
  return unless exact_or_closest

  driver_path = File.join(drivers_root, exact_or_closest, "chromedriver")
  driver_path if File.executable?(driver_path)
end

Capybara.register_driver :headless_chrome do |app|
  options = Selenium::WebDriver::Chrome::Options.new
  options.add_argument("--headless=new")
  options.add_argument("--disable-gpu")
  options.add_argument("--no-sandbox")
  options.add_argument("--window-size=1400,1400")
  # Disable Chrome's password manager/save-password prompt: it renders a
  # native infobar after any password field is submitted, which can steal
  # focus/layout on the next visit and make later fill_in calls flaky.
  options.add_preference("credentials_enable_service", false)
  options.add_preference("profile.password_manager_enabled", false)

  service_path = matching_chromedriver_path
  service = Selenium::WebDriver::Service.chrome(path: service_path) if service_path

  Capybara::Selenium::Driver.new(app, browser: :chrome, options: options, service: service)
end

Capybara.javascript_driver = :headless_chrome
Capybara.default_driver = :headless_chrome
# Give each parallel_tests worker its own server port so concurrent system
# specs don't collide on the same port (ENV["TEST_ENV_NUMBER"] is blank for
# worker 1, "2", "3", ... for the rest).
Capybara.server_port = 9887 + ENV["TEST_ENV_NUMBER"].to_i
# ponytail: this sandbox's default 2s wait can be too short under CPU load
# (same contention behind the fill_in race above), letting a slow Inertia
# redirect/render fail a have_current_path assertion that would pass a beat
# later. A longer wait is a one-line fix for every current-path/content
# assertion in every system spec; revisit if specs still flake past this.
Capybara.default_max_wait_time = 5

module ReliableFillIn
  # ponytail: under CPU load in this sandbox, Selenium's fast synthetic
  # typing occasionally races React's controlled-input re-render and only
  # the first keystroke sticks (most visible on a page hit for the first
  # time in a run, e.g. right after Vite compiles it on demand). Retrying
  # the fill is simpler than slowing down every keystroke; revisit if a
  # newer selenium-webdriver/chromedriver pairing fixes the race upstream.
  def fill_in_reliably(locator, with:)
    Timeout.timeout(5) do
      loop do
        fill_in(locator, with: with)
        break if find_field(locator).value == with
      end
    end
  end

  # ponytail: same click-vs-render race as fill_in_reliably above, but for a
  # click whose only observable trace is a side effect (a request fires, the
  # page navigates, a row disappears) rather than a field value we can read
  # back. Under CPU load a synthetic click can land before the page is fully
  # interactive and produce no effect at all -- nothing to inspect, just a
  # click that silently did nothing.
  #
  # `wait_for` is a Capybara predicate (e.g. `-> { page.has_current_path?(path) }`)
  # called with Capybara's own default wait (Capybara.default_max_wait_time),
  # so a click that DID register gets a full, generous window to show its
  # effect before we give up on it -- retrying too eagerly (e.g. on a short
  # per-attempt wait) risks firing the click again while the first one is
  # still legitimately in flight, double-submitting a form. Only once a
  # whole wait window has passed with no effect do we assume the click
  # itself was lost and try again, up to `attempts` times. Wrap an
  # `accept_confirm` around the click in the block if the click triggers a
  # JS confirm dialog -- `Capybara::ModalNotFound` (no dialog appeared,
  # because no click registered) is treated as "retry" like any other missed
  # effect. Revisit if a newer selenium-webdriver/chromedriver pairing fixes
  # the race upstream.
  def click_reliably(wait_for:, attempts: 5, &click)
    attempts.times do
      begin
        click.call
      rescue Capybara::ModalNotFound
        # The click that should have opened the confirm dialog never
        # registered -- fall through to retry below.
      end
      return if wait_for.call
    end
    raise "click_reliably: expected effect never happened after #{attempts} attempts"
  end
end

module SystemSessionHelpers
  # Shared sign-in flow for system specs. Uses fill_in_reliably for both
  # fields and waits for the post-login redirect to complete before
  # returning -- without that wait-assertion, a spec can start interacting
  # with the page before the redirect lands (the same login-redirect race
  # that caused a real flake in this project).
  def sign_in(user, password: "password123")
    visit new_session_path
    fill_in_reliably "Email", with: user.email_address
    fill_in_reliably "Password", with: password
    click_button "Sign in"
    expect(page).to have_current_path(user.admin? ? dashboard_path : profile_path)
  end
end

RSpec.configure do |config|
  config.include ReliableFillIn, type: :system
  config.include SystemSessionHelpers, type: :system
end
