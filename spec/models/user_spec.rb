require "rails_helper"

RSpec.describe User, type: :model do
  it "is valid with valid attributes" do
    expect(build(:user)).to be_valid
  end

  it "requires full_name" do
    user = build(:user, full_name: nil)
    expect(user).not_to be_valid
    expect(user.errors[:full_name]).to include("can't be blank")
  end

  it "requires a unique email_address" do
    create(:user, email_address: "dup@example.com")
    dup = build(:user, email_address: "dup@example.com")
    expect(dup).not_to be_valid
  end

  it "defaults role to user" do
    expect(build(:user).role).to eq("user")
  end

  it "supports the admin role" do
    expect(build(:user, :admin).role).to eq("admin")
  end

  it "accepts an avatar attachment" do
    user = create(:user)
    user.avatar.attach(
      io: File.open(Rails.root.join("spec/fixtures/files/avatar.png")),
      filename: "avatar.png",
      content_type: "image/png"
    )
    expect(user.avatar).to be_attached
  end

  it "rejects a non-image avatar content type" do
    user = build(:user)
    user.avatar.attach(
      io: StringIO.new("not an image"),
      filename: "file.txt",
      content_type: "text/plain"
    )
    expect(user).not_to be_valid
    expect(user.errors[:avatar]).to be_present
  end

  it "rejects an avatar over 5MB" do
    user = build(:user)
    user.avatar.attach(
      io: File.open(Rails.root.join("spec/fixtures/files/avatar.png")),
      filename: "avatar.png",
      content_type: "image/png"
    )
    allow(user.avatar).to receive(:byte_size).and_return(6.megabytes)

    expect(user).not_to be_valid
    expect(user.errors[:avatar]).to include("must be smaller than 5MB")
  end
end
