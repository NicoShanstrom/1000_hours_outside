class ChallengesController < ApplicationController
  before_action :authenticate_user!

  def show
    @challenge = current_user.challenges.find(params[:id])
    @outdoor_sessions = @challenge.outdoor_sessions.order(start_time: :desc)
  end
end
