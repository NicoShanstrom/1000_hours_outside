class TimeZonesController < ApplicationController
  before_action :authenticate_user!

  def set_time_zone
    if current_user.update(time_zone: params[:time_zone])
      head :ok # Respond with success
    else
      head :unprocessable_entity # Respond with an error
    end
  end
end
