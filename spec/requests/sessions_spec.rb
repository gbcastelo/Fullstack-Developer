require "rails_helper"

RSpec.describe "Sessions", type: :request do
  let(:user) { create(:user, password: "password123") }
  let(:admin) { create(:user, :admin, password: "password123") }

  describe "GET /session/new" do
    it "renders successfully without requiring authentication" do
      get new_session_path
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /session" do
    it "logs in a valid user and redirects non-admins to their profile" do
      post session_path, params: { email_address: user.email_address, password: "password123" }
      expect(response).to redirect_to(profile_path)
    end

    it "logs in a valid admin and redirects to the dashboard" do
      post session_path, params: { email_address: admin.email_address, password: "password123" }
      expect(response).to redirect_to(dashboard_path)
    end

    it "rejects invalid credentials" do
      post session_path, params: { email_address: user.email_address, password: "wrong" }
      expect(response).to redirect_to(new_session_path)
    end
  end

  describe "DELETE /session" do
    it "logs the user out" do
      post session_path, params: { email_address: user.email_address, password: "password123" }
      delete session_path
      expect(response).to redirect_to(new_session_path)
    end
  end
end
