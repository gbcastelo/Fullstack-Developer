require "rails_helper"

RSpec.describe DashboardChannel, type: :channel do
  it "successfully subscribes and streams from 'dashboard'" do
    subscribe
    expect(subscription).to be_confirmed
    expect(subscription).to have_stream_from("dashboard")
  end
end
