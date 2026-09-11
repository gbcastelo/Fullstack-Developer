require "rails_helper"

RSpec.describe "Login", type: :system do
  it "logs in and redirects a non-admin user to their profile" do
    user = create(:user, password: "password123")

    visit new_session_path
    fill_in "Email", with: user.email_address
    fill_in "Password", with: "password123"
    click_button "Sign in"

    expect(page).to have_current_path(profile_path)
  end

  it "logs in and redirects an admin to the dashboard" do
    admin = create(:user, :admin, password: "password123")

    visit new_session_path
    fill_in "Email", with: admin.email_address
    fill_in "Password", with: "password123"
    click_button "Sign in"

    expect(page).to have_current_path(dashboard_path)
  end

  it "shows a visible error and stays on the login page for a wrong password" do
    user = create(:user, password: "password123")

    visit new_session_path
    fill_in "Email", with: user.email_address
    fill_in "Password", with: "wrong-password"
    click_button "Sign in"

    expect(page).to have_current_path(new_session_path)
    expect(page).to have_content("Try another email address or password.")
  end
end
