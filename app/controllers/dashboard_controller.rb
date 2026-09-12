class DashboardController < ApplicationController
  before_action :require_admin!

  def show
    render inertia: "dashboard/show", props: {
      total_users: User.count,
      users_by_role: User.group(:role).count
    }
  end
end
