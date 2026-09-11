class ImportsController < ApplicationController
  before_action :require_admin!

  def new
    render inertia: "imports/new"
  end

  def create
    blob = ActiveStorage::Blob.create_and_upload!(
      io: params[:file].to_io,
      filename: params[:file].original_filename,
      content_type: params[:file].content_type
    )
    ImportUsersJob.perform_later(blob.signed_id)
    redirect_to users_path, notice: "Import started."
  end
end
