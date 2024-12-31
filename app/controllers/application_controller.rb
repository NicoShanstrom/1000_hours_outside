class ApplicationController < ActionController::Base
  around_action :set_time_zone

  private

  def set_time_zone
    Time.use_zone(current_user&.time_zone || 'UTC') do
      yield
    end
  end
end
