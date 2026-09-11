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
