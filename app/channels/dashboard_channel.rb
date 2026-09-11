class DashboardChannel < ApplicationCable::Channel
  def subscribed
    return reject unless current_user&.admin?

    stream_from "dashboard"
  end
end
