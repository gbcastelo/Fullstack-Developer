require "roo"

class ImportUsersJob < ApplicationJob
  queue_as :default

  def perform(blob_signed_id)
    blob = ActiveStorage::Blob.find_signed(blob_signed_id)
    errors = []

    blob.open do |file|
      spreadsheet = Roo::Spreadsheet.open(file.path, extension: File.extname(blob.filename.to_s))
      headers = spreadsheet.row(1)
      total = spreadsheet.last_row - 1

      broadcast_progress(status: "processing", processed: 0, total: total, errors: [])

      (2..spreadsheet.last_row).each do |i|
        row = Hash[headers.zip(spreadsheet.row(i))]
        user = User.new(
          full_name: row["full_name"],
          email_address: row["email_address"],
          password: row["password"],
          role: :user
        )

        if user.save
          # row succeeded
        else
          errors << "Row #{i}: #{user.errors.full_messages.to_sentence}"
        end

        broadcast_progress(status: "processing", processed: i - 1, total: total, errors: errors)
      end

      broadcast_progress(status: "done", processed: total, total: total, errors: errors)
    end
  ensure
    blob&.purge
  end

  private

  def broadcast_progress(payload)
    ActionCable.server.broadcast("imports", payload)
  end
end
