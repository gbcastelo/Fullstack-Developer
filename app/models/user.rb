class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy
  has_one_attached :avatar

  enum :role, { user: 0, admin: 1 }, default: :user

  normalizes :email_address, with: ->(email) { email.strip.downcase }
  encrypts :email_address, deterministic: true

  validates :email_address, presence: true, uniqueness: true,
    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :full_name, presence: true
  validate :avatar_must_be_an_image

  after_commit :broadcast_dashboard_counts

  private

  def avatar_must_be_an_image
    return unless avatar.attached?

    unless avatar.content_type.in?(%w[image/png image/jpeg image/webp])
      errors.add(:avatar, I18n.t("errors.avatar_invalid_type"))
    end

    if avatar.byte_size > 5.megabytes
      errors.add(:avatar, I18n.t("errors.avatar_too_large"))
    end
  end

  # ponytail: broadcasts on every commit (not just role/count-relevant
  # changes) for simplicity — at this app's scale a slightly chattier
  # channel costs nothing; add a saved_change_to_role? guard if this ever
  # needs to scale down broadcast volume.
  def broadcast_dashboard_counts
    ActionCable.server.broadcast("dashboard", {
      total_users: User.count,
      users_by_role: User.group(:role).count
    })
  end
end
