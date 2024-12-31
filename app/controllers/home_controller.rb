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

    @required_per_day = if @total_time >= 1000
                          "Achieved"
                        elsif Date.current.yday == 365
                          "Impossible"
                        else
                          ((1000 - @total_time) / (365 - Date.current.yday).to_f).round(2)
                        end

    @pace = ((@total_time / Date.current.yday.to_f) * 365).round(2)

    # Initialize a new OutdoorSession object
    @outdoor_session = OutdoorSession.new
  end
end
