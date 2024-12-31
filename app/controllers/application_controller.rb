class ApplicationController < ActionController::Base
  around_action :set_time_zone

  private

  def set_time_zone
    if current_user&.time_zone.present?
      Time.use_zone(current_user.time_zone) { yield }
    else
      Time.use_zone("UTC") { yield }
    end
  end
end
