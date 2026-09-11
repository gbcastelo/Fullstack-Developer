class DashboardController < ApplicationController
  def show
    render inertia: "dashboard/show"
  end
end
