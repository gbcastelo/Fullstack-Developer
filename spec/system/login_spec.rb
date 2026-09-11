require "rails_helper"

RSpec.describe "Login", type: :system do
  it "logs in and redirects a non-admin user to their profile" do
    user = create(:user, password: "password123")

    sign_in(user)
  end

  it "logs in and redirects an admin to the dashboard" do
    admin = create(:user, :admin, password: "password123")

    sign_in(admin)
  end

  it "shows a visible error and stays on the login page for a wrong password" do
    user = create(:user, password: "password123")

    visit new_session_path
    fill_in_reliably "Email", with: user.email_address
    fill_in_reliably "Password", with: "wrong-password"
    click_button "Sign in"

    expect(page).to have_current_path(new_session_path)
    expect(page).to have_content("Try another email address or password.")
  end

  it "provides a link to registration" do
    visit new_session_path

    click_link "Create an account"

    expect(page).to have_current_path(register_path)
  end

  it "provides a way to sign out" do
    user = create(:user, password: "password123")
    sign_in(user)

    click_button "Sign out"

    expect(page).to have_current_path(new_session_path)
  end
end
