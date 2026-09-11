require "rails_helper"

RSpec.describe "Admin Users CRUD", type: :system do
  let(:admin) { create(:user, :admin, password: "password123") }

  it "lets an admin create, toggle role, and delete a user" do
    sign_in(admin)
    visit users_path

    click_link "New user"
    fill_in_reliably "Full name", with: "Test Target"
    fill_in_reliably "Email", with: "target@example.com"
    fill_in_reliably "Password", with: "password123"
    click_reliably(wait_for: -> { page.has_current_path?(users_path) }) { click_button "Create" }

    expect(page).to have_current_path(users_path)
    expect(page).to have_content("Test Target")

    click_reliably(wait_for: -> { page.has_content?("admin", count: 2) }) do
      within("tr", text: "Test Target") { click_button "Toggle role" }
    end
    expect(page).to have_content("admin", count: 2) # seeded admin + toggled target

    click_reliably(wait_for: -> { page.has_no_content?("Test Target") }) do
      accept_confirm do
        within("tr", text: "Test Target") { click_button "Delete" }
      end
    end
    expect(page).not_to have_content("Test Target")
  end
end
