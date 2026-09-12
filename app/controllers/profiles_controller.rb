class ProfilesController < ApplicationController
  def show
    render inertia: "profiles/show", props: { user: current_user_props }
  end

  def edit
    render inertia: "profiles/edit", props: { user: current_user_props }
  end

  def update
    if Current.user.update(profile_params)
      redirect_to profile_path
    else
      render inertia: "profiles/edit", props: { user: current_user_props, errors: Current.user.errors }, status: :unprocessable_content
    end
  end

  def destroy
    Current.user.destroy
    terminate_session
    redirect_to new_session_path
  end

  private

  def profile_params
    params.require(:user).permit(:full_name, :avatar)
  end

  def current_user_props
    Current.user.as_json(only: %i[id full_name email_address role]).merge(avatar_url: avatar_url(Current.user))
  end
end
