class ApplicationController < ActionController::Base
  include Authentication
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes

  # Share the Rails flash (e.g. login alerts) with every Inertia page as a
  # `flash` prop, so React pages can render it instead of it disappearing
  # silently after a redirect.
  inertia_share flash: -> { flash.to_hash }

  private

  def require_admin!
    redirect_to profile_path, alert: "You are not authorized to view this page." unless Current.user.admin?
  end
end
