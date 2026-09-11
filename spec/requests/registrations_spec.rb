require "rails_helper"

RSpec.describe "Registrations", type: :request do
  describe "POST /register" do
    it "creates a user with the default role and logs them in" do
      expect {
        post register_path, params: {
          user: { full_name: "New Person", email_address: "new@example.com", password: "password123" }
        }
      }.to change(User, :count).by(1)

      expect(User.last.role).to eq("user")
      expect(response).to redirect_to(profile_path)
    end

    it "ignores a role param if one is submitted (no admin self-registration)" do
      post register_path, params: {
        user: { full_name: "Sneaky", email_address: "sneaky@example.com", password: "password123", role: "admin" }
      }
      expect(User.last.role).to eq("user")
    end

    it "re-renders with errors on invalid input" do
      expect {
        post register_path, params: { user: { full_name: "", email_address: "", password: "" } }
      }.not_to change(User, :count)

      expect(response).to have_http_status(:unprocessable_content)
    end
  end
end
