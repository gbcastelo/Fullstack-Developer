require "rails_helper"

RSpec.describe ImportUsersJob, type: :job do
  def blob_for(fixture_name, content_type)
    ActiveStorage::Blob.create_and_upload!(
      io: File.open(Rails.root.join("spec/fixtures/files/#{fixture_name}")),
      filename: fixture_name,
      content_type: content_type
    )
  end

  it "creates users from a valid CSV, always as role user" do
    blob = blob_for("users_import.csv", "text/csv")

    expect {
      ImportUsersJob.perform_now(blob.signed_id)
    }.to change(User, :count).by(2)

    expect(User.find_by(email_address: "import1@example.com").role).to eq("user")
  end

  it "creates users from a valid xlsx file" do
    blob = blob_for("users_import.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

    expect {
      ImportUsersJob.perform_now(blob.signed_id)
    }.to change(User, :count).by(2)
  end

  it "skips invalid rows without aborting the whole import" do
    blob = blob_for("users_import_with_errors.csv", "text/csv")

    expect {
      ImportUsersJob.perform_now(blob.signed_id)
    }.to change(User, :count).by(1) # only "Valid Row" succeeds

    expect(User.exists?(email_address: "valid@example.com")).to be true
    expect(User.exists?(email_address: "missing-name@example.com")).to be false
  end

  it "purges the blob after processing" do
    blob = blob_for("users_import.csv", "text/csv")
    ImportUsersJob.perform_now(blob.signed_id)
    expect(ActiveStorage::Blob.exists?(blob.id)).to be false
  end

  it "broadcasts progress as it processes rows" do
    blob = blob_for("users_import.csv", "text/csv")

    expect {
      ImportUsersJob.perform_now(blob.signed_id)
    }.to have_broadcasted_to("imports").at_least(3).times
    # start, per-row (x2), done — at least 3
  end

  it "broadcasts a final status of done with the total and any errors" do
    blob = blob_for("users_import_with_errors.csv", "text/csv")

    expect {
      ImportUsersJob.perform_now(blob.signed_id)
    }.to have_broadcasted_to("imports").with(hash_including(status: "done", processed: 3))
  end
end
