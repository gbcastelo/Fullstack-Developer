require "rails_helper"

RSpec.describe "Profiles", type: :request do
  let(:user) { create(:user, password: "password123") }

  def sign_in(user)
    post session_path, params: { email_address: user.email_address, password: "password123" }
  end

  describe "GET /profile" do
    it "requires authentication" do
      get profile_path
      expect(response).to redirect_to(new_session_path)
    end

    it "shows the current user's own data" do
      sign_in(user)
      get profile_path
      expect(response).to have_http_status(:ok)
    end
  end

  describe "PATCH /profile" do
    it "updates the current user's own full_name" do
      sign_in(user)
      patch profile_path, params: { user: { full_name: "Updated Name" } }
      expect(user.reload.full_name).to eq("Updated Name")
      expect(response).to redirect_to(profile_path)
    end
  end

  describe "DELETE /profile" do
    it "deletes the current user's own account and logs them out" do
      sign_in(user)
      expect { delete profile_path }.to change(User, :count).by(-1)
      expect(response).to redirect_to(new_session_path)
    end
  end
end
