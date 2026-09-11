class ImportChannel < ApplicationCable::Channel
  def subscribed
    return reject unless current_user&.admin?

    stream_from "imports"
  end
end
