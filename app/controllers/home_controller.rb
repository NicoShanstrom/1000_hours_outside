class HomeController < ApplicationController
  before_action :authenticate_user!

  def index
    # Fetch or create the current year's challenge
    @current_challenge = current_user.challenges.find_or_create_by(year: Date.current.year) do |challenge|
      challenge.start_date = Date.new(Date.current.year, 1, 1)
      challenge.end_date = Date.new(Date.current.year, 12, 31)
    end

    # Fetch previous challenges and initialize to an empty array if none exist
    @previous_challenges = current_user.challenges.where.not(year: Date.current.year).order(year: :desc).to_a

    # Initialize statistics
    @sessions = @current_challenge.outdoor_sessions.order(start_time: :desc)
    @total_time = @current_challenge.outdoor_sessions.sum(:duration)
    @average_per_day = (@total_time / Date.current.yday.to_f).round(2)

    now = Time.current
    end_of_year = Time.zone.local(now.year, 12, 31, 23, 59, 59)
    remaining_days = (Date.new(Date.current.year, 12, 31) - Date.current).to_i + 1 # Including today
    @remaining_time_in_hours = ((end_of_year - now) / 1.hour).round(2)

    @hours_remaining_to_goal = if @total_time >= 1000
      0
    else
      (1000 - @total_time).round(2)
    end

    # Calculate required per day and handle "Impossible" logic
    if @total_time >= 1000
      @required_per_day = "Achieved"
    elsif @hours_remaining_to_goal > @remaining_time_in_hours
      @required_per_day = "Impossible"
    else
      @required_per_day = (@hours_remaining_to_goal / remaining_days.to_f).round(2)
    end

    @pace = ((@total_time / Date.current.yday.to_f) * 365).round(2)

    # Initialize a new OutdoorSession object
    @outdoor_session = OutdoorSession.new
    @current_session = current_user.outdoor_sessions.find_by(end_time: nil)
  end
end
