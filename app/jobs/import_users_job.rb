require "roo"

class ImportUsersJob < ApplicationJob
  queue_as :default

  def perform(blob_signed_id)
    blob = ActiveStorage::Blob.find_signed(blob_signed_id)

    blob.open do |file|
      spreadsheet = Roo::Spreadsheet.open(file.path, extension: File.extname(blob.filename.to_s))
      headers = spreadsheet.row(1)

      (2..spreadsheet.last_row).each do |i|
        row = Hash[headers.zip(spreadsheet.row(i))]
        User.create(
          full_name: row["full_name"],
          email_address: row["email_address"],
          password: row["password"],
          role: :user
        )
      end
    end
  ensure
    blob&.purge
  end
end
