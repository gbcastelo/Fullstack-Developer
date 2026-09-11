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

  private

  def avatar_must_be_an_image
    return unless avatar.attached?

    unless avatar.content_type.in?(%w[image/png image/jpeg image/webp])
      errors.add(:avatar, "must be a PNG, JPEG, or WEBP image")
    end

    if avatar.byte_size > 5.megabytes
      errors.add(:avatar, "must be smaller than 5MB")
    end
  end
end
