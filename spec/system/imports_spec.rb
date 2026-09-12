require "rails_helper"

RSpec.describe "Spreadsheet import", type: :system do
  it "lets an admin upload a CSV and see the new users afterward" do
    admin = create(:user, :admin, password: "password123")

    sign_in(admin)
    visit new_import_path

    attach_file "file", Rails.root.join("spec/fixtures/files/users_import.csv"), visible: false, make_visible: true
    click_button "Upload"

    # Inertia submits the upload via XHR, so click_button returns before the
    # browser's request even reaches the controller -- under load the whole
    # round trip can complete faster than Capybara's next poll, so a
    # button-disabled-state assertion can miss the window entirely. Poll the
    # job queue directly instead: wait for the enqueue to land before
    # draining it, otherwise perform_enqueued_jobs can run before the job
    # even exists and silently perform nothing. The redirect target is
    # /imports/new itself now, so (unlike the old users_path redirect) the
    # useImportChannel subscription on this page stays mounted and actually
    # receives the broadcasts the job fires.
    Timeout.timeout(Capybara.default_max_wait_time) { sleep 0.02 until enqueued_jobs.any? }
    perform_enqueued_jobs

    expect(page).to have_selector("[data-testid='import-progress']")
    expect(page).to have_content("Status: done")

    visit users_path

    expect(page).to have_content("Import One")
    expect(page).to have_content("Import Two")
  end
end
