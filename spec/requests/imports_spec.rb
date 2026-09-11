require "rails_helper"

RSpec.describe "Imports", type: :request do
  let(:admin) { create(:user, :admin, password: "password123") }

  def sign_in(user)
    post session_path, params: { email_address: user.email_address, password: "password123" }
  end

  it "blocks non-admins" do
    sign_in(create(:user, password: "password123"))
    post imports_path, params: { file: fixture_file_upload("users_import.csv", "text/csv") }
    expect(response).to redirect_to(profile_path)
  end

  it "enqueues ImportUsersJob for an admin upload" do
    sign_in(admin)

    expect {
      post imports_path, params: { file: fixture_file_upload("users_import.csv", "text/csv") }
    }.to have_enqueued_job(ImportUsersJob)

    expect(response).to redirect_to(users_path)
  end
end
