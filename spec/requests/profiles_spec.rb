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

    it "includes a usable avatar_url once an avatar is attached" do
      sign_in(user)
      user.avatar.attach(
        io: File.open(Rails.root.join("spec/fixtures/files/avatar.png")),
        filename: "avatar.png",
        content_type: "image/png"
      )

      get profile_path

      page_json = response.body[/data-page="app" type="application\/json">(.*?)<\/script>/m, 1]
      props = JSON.parse(page_json)["props"]
      expect(props["user"]["avatar_url"]).to include("/rails/active_storage/blobs/")
    end
  end

  describe "PATCH /profile" do
    it "updates the current user's own full_name" do
      sign_in(user)
      patch profile_path, params: { user: { full_name: "Updated Name" } }
      expect(user.reload.full_name).to eq("Updated Name")
      expect(response).to redirect_to(profile_path)
    end

    it "attaches an uploaded avatar" do
      sign_in(user)
      avatar = fixture_file_upload("avatar.png", "image/png")

      patch profile_path, params: { user: { avatar: avatar } }

      expect(user.reload.avatar).to be_attached
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
