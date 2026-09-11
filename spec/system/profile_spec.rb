require "rails_helper"

RSpec.describe "Profile", type: :system do
  let(:user) { create(:user, password: "password123") }

  def sign_in(user)
    visit new_session_path
    fill_in_reliably "Email", with: user.email_address
    fill_in_reliably "Password", with: "password123"
    click_button "Sign in"
    expect(page).to have_current_path(profile_path)
  end

  it "lets a user edit their own full name" do
    sign_in(user)
    visit "/profile/edit"

    fill_in_reliably user.full_name, with: "Renamed User"
    click_button "Save"

    expect(page).to have_current_path(profile_path)
    expect(page).to have_content("Renamed User")
  end

  it "lets a user delete their own account" do
    sign_in(user)
    visit "/profile/edit"

    accept_confirm do
      click_button "Delete my account"
    end

    expect(page).to have_current_path(new_session_path)
    expect(User.exists?(user.id)).to be false
  end
end
