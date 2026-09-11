require "rails_helper"

RSpec.describe ImportChannel, type: :channel do
  it "rejects non-admin subscribers" do
    stub_connection current_user: create(:user, password: "password123")
    subscribe
    expect(subscription).to be_rejected
  end

  it "confirms and streams for an admin" do
    stub_connection current_user: create(:user, :admin, password: "password123")
    subscribe
    expect(subscription).to be_confirmed
    expect(subscription).to have_stream_from("imports")
  end
end
