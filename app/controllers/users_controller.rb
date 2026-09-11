class UsersController < ApplicationController
  before_action :require_admin!
  before_action :set_user, only: %i[edit update destroy toggle_role]
  before_action :prevent_self_modification, only: %i[destroy toggle_role]

  def index
    render inertia: "users/index", props: { users: user_list }
  end

  def new
    render inertia: "users/new"
  end

  def create
    user = User.new(user_params)
    if user.save
      redirect_to users_path, notice: "User created."
    else
      render inertia: "users/new", props: { errors: user.errors }, status: :unprocessable_content
    end
  end

  def edit
    render inertia: "users/edit", props: { user: user_json(@user) }
  end

  def update
    if @user.update(edit_params)
      redirect_to users_path, notice: "User updated."
    else
      render inertia: "users/edit", props: { user: user_json(@user), errors: @user.errors }, status: :unprocessable_content
    end
  end

  def destroy
    @user.destroy
    redirect_to users_path, notice: "User deleted."
  end

  def toggle_role
    @user.update!(role: @user.admin? ? :user : :admin)
    redirect_to users_path
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def prevent_self_modification
    return unless @user == Current.user

    redirect_to users_path, alert: "You cannot delete or change your own role here."
  end

  def user_list
    User.order(:full_name).map { |u| user_json(u) }
  end

  def user_json(user)
    user.as_json(only: %i[id full_name email_address role])
  end

  def user_params
    params.require(:user).permit(:full_name, :email_address, :password, :role)
  end

  def edit_params
    params.require(:user).permit(:full_name, :email_address, :role)
  end
end
