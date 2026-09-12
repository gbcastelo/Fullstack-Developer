require "rails_helper"

RSpec.describe "Users (admin)", type: :request do
  let(:admin) { create(:user, :admin, password: "password123") }

  def sign_in(user)
    post session_path, params: { email_address: user.email_address, password: "password123" }
  end

  it "blocks non-admins from every action" do
    user = create(:user, password: "password123")
    target = create(:user, password: "password123")
    sign_in(user)

    get users_path
    expect(response).to redirect_to(profile_path)

    post users_path, params: { user: { full_name: "New", email_address: "new@example.com", password: "password123", role: "admin" } }
    expect(response).to redirect_to(profile_path)

    patch toggle_role_user_path(target)
    expect(response).to redirect_to(profile_path)
  end

  describe "as an admin" do
    before { sign_in(admin) }

    it "lists users" do
      create_list(:user, 2, password: "password123")
      get users_path
      expect(response).to have_http_status(:ok)
    end

    it "renders the edit form" do
      target = create(:user, password: "password123")
      get edit_user_path(target)
      expect(response).to have_http_status(:ok)
    end

    it "creates a user with an explicit role" do
      expect {
        post users_path, params: { user: { full_name: "New", email_address: "new@example.com", password: "password123", role: "admin" } }
      }.to change(User, :count).by(1)
      expect(User.last.role).to eq("admin")
      expect(response).to redirect_to(users_path)
    end

    it "updates a user's full_name and role" do
      target = create(:user, password: "password123")
      patch user_path(target), params: { user: { full_name: "Renamed", role: "admin" } }
      target.reload
      expect(target.full_name).to eq("Renamed")
      expect(target.role).to eq("admin")
    end

    it "deletes a user" do
      target = create(:user, password: "password123")
      expect { delete user_path(target) }.to change(User, :count).by(-1)
    end

    it "toggles a user's role" do
      target = create(:user, password: "password123")
      patch toggle_role_user_path(target)
      expect(target.reload.role).to eq("admin")
      patch toggle_role_user_path(target)
      expect(target.reload.role).to eq("user")
    end

    it "refuses to delete their own account" do
      expect { delete user_path(admin) }.not_to change(User, :count)
      expect(response).to redirect_to(users_path)
      expect(flash[:alert]).to eq("You cannot delete or change your own role here.")
    end

    it "refuses to toggle their own role" do
      patch toggle_role_user_path(admin)
      expect(admin.reload.role).to eq("admin")
      expect(response).to redirect_to(users_path)
      expect(flash[:alert]).to eq("You cannot delete or change your own role here.")
    end
  end
end
