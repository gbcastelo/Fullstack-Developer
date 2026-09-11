require "rails_helper"

RSpec.describe "Registration", type: :system do
  it "lets a visitor self-register as a standard user" do
    visit register_path

    fill_in_reliably "Full name", with: "Jane Visitor"
    fill_in_reliably "Email", with: "jane@example.com"
    fill_in_reliably "Password", with: "password123"
    click_button "Register"

    expect(page).to have_current_path(profile_path)
    expect(User.last.role).to eq("user")
  end
end
