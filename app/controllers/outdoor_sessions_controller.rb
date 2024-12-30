class OutdoorSessionsController < ApplicationController
  before_action :authenticate_user!

  def create
    @outdoor_session = current_user.outdoor_sessions.build(outdoor_session_params)

    if @outdoor_session.save
      flash[:notice] = params[:outdoor_session][:manual_creation] ? "Outdoor session created successfully" : "Outdoor session started successfully"
    else
      flash[:alert] = @outdoor_session.errors.full_messages.to_sentence
    end
    redirect_to root_path
  end

  def update
    @outdoor_session = current_user.outdoor_sessions.find(params[:id])

    if params[:outdoor_session][:stop_timer] == "true"
      update_params = { end_time: Time.current, duration: ((Time.current - @outdoor_session.start_time) / 1.hour).round(2), description: params[:outdoor_session][:description] }
      success_message = "Outdoor session ended successfully"
    else
      update_params = outdoor_session_params
      success_message = "Outdoor session updated successfully"
    end

    if @outdoor_session.update(update_params)
      flash[:notice] = success_message
    else
      flash[:alert] = @outdoor_session.errors.full_messages.to_sentence
    end
    redirect_to root_path
  end

  private

  def outdoor_session_params
    params.require(:outdoor_session).permit(:start_time, :end_time, :duration, :description)
  end
end
