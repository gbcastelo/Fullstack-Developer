require "rails_helper"

RSpec.describe "Spreadsheet import", type: :system do
  it "lets an admin upload a CSV and see the new users afterward" do
    admin = create(:user, :admin, password: "password123")

    sign_in(admin)
    visit new_import_path

    attach_file "file", Rails.root.join("spec/fixtures/files/users_import.csv"), visible: false, make_visible: true
    click_button "Upload"

    # Inertia submits the upload via XHR and client-side-routes to /users on
    # redirect, so wait for that navigation to land (confirming the server
    # has enqueued the job) before running it -- otherwise perform_enqueued_jobs
    # can fire before the async request even reaches the controller and finds
    # nothing queued yet. The import job runs on this (main) thread rather
    # than the Capybara server thread, so /users needs a fresh visit
    # afterward to render the users it just created.
    expect(page).to have_current_path(users_path)
    perform_enqueued_jobs
    visit users_path

    expect(page).to have_content("Import One")
    expect(page).to have_content("Import Two")
  end
end
