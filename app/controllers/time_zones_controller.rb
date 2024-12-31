class TimeZonesController < ApplicationController
  before_action :authenticate_user!

  def set_time_zone
    if params[:time_zone].present? && current_user.update(time_zone: params[:time_zone])
      respond_to do |format|
        format.html { redirect_to root_path, notice: "Time zone updated successfully!" }
        format.json { render json: { status: "success" } }
      end
    else
      respond_to do |format|
        format.html { redirect_to root_path, alert: "Failed to update time zone." }
        format.json { render json: { status: "error", message: "Invalid time zone" }, status: :unprocessable_entity }
      end
    end
  end
end
