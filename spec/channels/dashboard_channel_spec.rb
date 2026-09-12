require "rails_helper"

RSpec.describe DashboardChannel, type: :channel do
  it "successfully subscribes and streams from 'dashboard' for an admin" do
    stub_connection current_user: create(:user, :admin)

    subscribe

    expect(subscription).to be_confirmed
    expect(subscription).to have_stream_from("dashboard")
  end

  it "rejects the subscription for a non-admin user" do
    stub_connection current_user: create(:user)

    subscribe

    expect(subscription).to be_rejected
  end
end
