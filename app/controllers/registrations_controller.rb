class RegistrationsController < ApplicationController
  allow_unauthenticated_access only: %i[ new create ]

  def new
    render inertia: "registrations/new"
  end

  def create
    user = User.new(registration_params.merge(role: :user))

    if user.save
      start_new_session_for user
      redirect_to profile_path
    else
      render inertia: "registrations/new", props: { errors: user.errors }, status: :unprocessable_content
    end
  end

  private

  def registration_params
    params.require(:user).permit(:full_name, :email_address, :password)
  end
end
