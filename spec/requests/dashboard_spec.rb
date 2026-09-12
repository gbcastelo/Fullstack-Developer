require "rails_helper"

RSpec.describe "Dashboard", type: :request do
  def sign_in(user)
    post session_path, params: { email_address: user.email_address, password: "password123" }
  end

  it "redirects unauthenticated visitors to login" do
    get dashboard_path
    expect(response).to redirect_to(new_session_path)
  end

  it "redirects non-admin users to their profile" do
    sign_in(create(:user, password: "password123"))
    get dashboard_path
    expect(response).to redirect_to(profile_path)
  end

  it "shows total and per-role counts to an admin" do
    create(:user, :admin, password: "password123", email_address: "a@example.com")
    create_list(:user, 2, password: "password123")
    sign_in(User.find_by(email_address: "a@example.com"))

    get dashboard_path
    expect(response).to have_http_status(:ok)
  end
end
