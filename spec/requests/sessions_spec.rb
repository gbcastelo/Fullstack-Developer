require "rails_helper"

RSpec.describe "Sessions", type: :request do
  let(:user) { create(:user, password: "password123") }
  let(:admin) { create(:user, :admin, password: "password123") }

  describe "GET /session/new" do
    it "renders successfully without requiring authentication" do
      get new_session_path
      expect(response).to have_http_status(:ok)
    end

    it "server-renders the page content via Inertia SSR" do
      get new_session_path

      # This is normally client-rendered React content. If it shows up in the raw
      # response body, the Inertia SSR bundle actually rendered it server-side
      # rather than leaving an empty root div for the client to hydrate.
      expect(response.body).to include("Sign in")
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
