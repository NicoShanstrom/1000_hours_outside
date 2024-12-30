class HomeController < ApplicationController
  before_action :authenticate_user!

  def index
    @current_session = current_user.outdoor_sessions.find_by(end_time: nil)
    @outdoor_session = OutdoorSession.new
    @sessions = current_user.outdoor_sessions.where.not(end_time: nil).order(start_time: :desc)
    @total_time = @sessions.sum(:duration) || 0
    @average_per_day = @total_time / Date.today.yday
    remaining_days = [365 - Date.today.yday, 1].max # Ensure at least one day
    hours_remaining_in_year = remaining_days * 24

    if @total_time >= 1000
      @required_per_day = "Achieved"
    elsif (1000 - @total_time) <= hours_remaining_in_year
      # Calculate required per day if it's feasible to achieve
      @required_per_day = (1000 - @total_time) / remaining_days
    else
      @required_per_day = "Impossible"
    end

    @pace = @total_time / Date.today.yday * 365
  end
end
