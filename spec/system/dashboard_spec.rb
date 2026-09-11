require "rails_helper"

RSpec.describe "Dashboard", type: :system do
  it "shows an admin the correct total and per-role counts" do
    admin = create(:user, :admin, password: "password123")
    create_list(:user, 2, password: "password123")

    sign_in(admin)

    expect(page).to have_current_path(dashboard_path)
    expect(page).to have_content("3") # total: admin + 2 users
    expect(page).to have_content("admin: 1")
    expect(page).to have_content("user: 2")
  end
end
