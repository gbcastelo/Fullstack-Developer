class ApplicationController < ActionController::Base
  include Authentication
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes

  around_action :set_locale

  # Share the Rails flash (e.g. login alerts) with every Inertia page as a
  # `flash` prop, so React pages can render it instead of it disappearing
  # silently after a redirect.
  inertia_share flash: -> { flash.to_hash }

  # Share the signed-in user with every Inertia page (nil on unauthenticated
  # pages like login/registration) so a shared nav/shell can render
  # consistently without every controller having to pass it explicitly.
  inertia_share do
    {
      current_user: Current.user&.as_json(only: %i[id full_name email_address role])
        &.merge(avatar_url: avatar_url(Current.user)),
      locale: I18n.locale.to_s
    }
  end

  private

  # Locale is picked from a plain `locale` cookie (set client-side by the
  # language toggle, no dedicated endpoint needed) rather than
  # Accept-Language, so a user's explicit choice always wins. Defaults to
  # I18n.default_locale (English) for anyone who never touched the toggle --
  # this keeps every existing English-locked test passing without setting
  # cookies of their own.
  def set_locale(&action)
    requested = cookies[:locale]
    locale = I18n.available_locales.map(&:to_s).include?(requested) ? requested : I18n.default_locale
    I18n.with_locale(locale, &action)
  end

  def require_admin!
    redirect_to profile_path, alert: t("flash.not_authorized") unless Current.user.admin?
  end

  # ActiveStorage attachments aren't plain attributes, so as_json's `only:`
  # can't include them -- every place that serializes a user for an Inertia
  # page needs this to actually show the avatar it lets people upload.
  def avatar_url(user)
    rails_blob_path(user.avatar, only_path: true) if user&.avatar&.attached?
  end
end
