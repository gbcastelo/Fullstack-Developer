class ProfilesController < ApplicationController
  def show
    render inertia: "profiles/show", props: { user: Current.user.as_json(only: %i[id full_name email_address role]) }
  end
end
