class TimeZonesController < ApplicationController
  before_action :authenticate_user!

  def set_time_zone
    if params[:time_zone].present? && current_user.update(time_zone: params[:time_zone])
      render json: { status: "success" }
    else
      render json: { status: "error", message: "Invalid time zone" }, status: :unprocessable_entity
    end
  end
end
