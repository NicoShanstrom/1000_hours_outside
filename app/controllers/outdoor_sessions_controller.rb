class OutdoorSessionsController < ApplicationController
  before_action :authenticate_user!

  def create
    # Fetch or create the current year's challenge
    current_challenge = current_user.challenges.find_or_create_by(year: Date.current.year) do |challenge|
      challenge.start_date = Date.new(Date.current.year, 1, 1)
      challenge.end_date = Date.new(Date.current.year, 12, 31)
    end

    # Build the outdoor session associated with the current challenge
    @outdoor_session = current_challenge.outdoor_sessions.build(outdoor_session_params.merge(user_id: current_user.id))

    if @outdoor_session.save
      flash[:notice] = params[:outdoor_session][:manual_creation] ? "Outdoor session created successfully" : "Outdoor session started successfully"
    else
      flash[:alert] = @outdoor_session.errors.full_messages.to_sentence
    end

    redirect_to root_path
  end

  def update
    begin
      @outdoor_session = current_user.outdoor_sessions.find(params[:id])

      if params[:outdoor_session][:stop_timer] == "true"
        update_params = {
          end_time: Time.current,
          duration: ((Time.current - @outdoor_session.start_time) / 1.hour).round(2),
          description: params[:outdoor_session][:description]
        }
        success_message = "Outdoor session ended successfully"
      else
        update_params = outdoor_session_params
        success_message = "Outdoor session updated successfully"
      end

      if @outdoor_session.update(update_params)
        # Reset current session if the timer is stopped
        @current_session = nil if params[:outdoor_session][:stop_timer] == "true"
        flash[:notice] = success_message
      else
        flash[:alert] = @outdoor_session.errors.full_messages.to_sentence
      end
    rescue ActiveRecord::RecordNotFound
      @current_session = nil # Explicitly reset current session
      flash[:alert] = "The session you are trying to update no longer exists."
    end

    redirect_to root_path
  end

  def destroy
    @outdoor_session = current_user.outdoor_sessions.find(params[:id])
    if @outdoor_session.destroy
      flash[:notice] = "Outdoor session deleted successfully"
    else
      flash[:alert] = "Failed to delete the outdoor session"
    end
    redirect_to root_path
  end

  private

  def outdoor_session_params
    params.require(:outdoor_session).permit(:start_time, :end_time, :duration, :description)
  end
end
