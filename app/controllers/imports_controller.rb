class ImportsController < ApplicationController
  before_action :require_admin!

  def new
    render inertia: "imports/new"
  end

  def create
    return redirect_to new_import_path, alert: t("flash.choose_a_file") unless params[:file].respond_to?(:to_io)

    blob = ActiveStorage::Blob.create_and_upload!(
      io: params[:file].to_io,
      filename: params[:file].original_filename,
      content_type: params[:file].content_type
    )
    ImportUsersJob.perform_later(blob.signed_id)
    redirect_to new_import_path, notice: t("flash.import_started")
  end
end
