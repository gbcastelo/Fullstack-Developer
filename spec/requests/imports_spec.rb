require "rails_helper"

RSpec.describe "Imports", type: :request do
  let(:admin) { create(:user, :admin, password: "password123") }

  def sign_in(user)
    post session_path, params: { email_address: user.email_address, password: "password123" }
  end

  describe "GET /imports/new" do
    it "redirects non-admins to their profile" do
      sign_in(create(:user, password: "password123"))
      get new_import_path
      expect(response).to redirect_to(profile_path)
    end

    it "renders for an admin" do
      sign_in(admin)
      get new_import_path
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /imports" do
    it "blocks non-admins" do
      sign_in(create(:user, password: "password123"))
      post imports_path, params: { file: fixture_file_upload("users_import.csv", "text/csv") }
      expect(response).to redirect_to(profile_path)
    end

    it "enqueues ImportUsersJob for an admin upload and returns to the import page" do
      sign_in(admin)

      expect {
        post imports_path, params: { file: fixture_file_upload("users_import.csv", "text/csv") }
      }.to have_enqueued_job(ImportUsersJob)

      expect(response).to redirect_to(new_import_path)
    end

    it "rejects a missing file" do
      sign_in(admin)
      post imports_path, params: {}
      expect(response).to redirect_to(new_import_path)
    end
  end
end
