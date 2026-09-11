require "rails_helper"

RSpec.describe "Sessions", type: :request do
  describe "GET /session/new" do
    it "renders successfully without requiring authentication" do
      get new_session_path
      expect(response).to have_http_status(:ok)
    end
  end
end
