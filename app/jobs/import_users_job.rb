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

        errors << "Row #{i}: #{user.errors.full_messages.to_sentence}" unless user.save

        # Skip the interim broadcast on the last row: it would carry the same
        # processed count as the "done" broadcast right after it with no real
        # work in between (every other pair of broadcasts is naturally spaced
        # out by a row's save call), and firing both back-to-back races on
        # ActionCable's async delivery -- the client can render whichever one
        # its thread pool happens to deliver last, occasionally dropping the
        # final "done" update.
        broadcast_progress(status: "processing", processed: i - 1, total: total, errors: errors) unless i == spreadsheet.last_row
      end

      broadcast_progress(status: "done", processed: total, total: total, errors: errors)
    end
  rescue => e
    broadcast_progress(status: "failed", processed: 0, total: 0, errors: [ e.message ])
    raise
  ensure
    blob&.purge
  end

  private

  def broadcast_progress(payload)
    ActionCable.server.broadcast("imports", payload)
  end
end
