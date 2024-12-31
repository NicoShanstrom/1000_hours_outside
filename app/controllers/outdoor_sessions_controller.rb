class OutdoorSessionsController < ApplicationController
  before_action :authenticate_user!

  def create
    # Parse start_time
    if outdoor_session_params[:start_time].present?
      start_time = DateTime.parse(outdoor_session_params[:start_time])
    else
      start_time = DateTime.new(
        outdoor_session_params["start_time(1i)"].to_i,
        outdoor_session_params["start_time(2i)"].to_i,
        outdoor_session_params["start_time(3i)"].to_i,
        outdoor_session_params["start_time(4i)"].to_i,
        outdoor_session_params["start_time(5i)"].to_i
      )
    end

    # Parse end_time if present, otherwise set it to nil
    end_time = if outdoor_session_params[:end_time].present?
                DateTime.parse(outdoor_session_params[:end_time])
              elsif outdoor_session_params["end_time(1i)"].present?
                DateTime.new(
                  outdoor_session_params["end_time(1i)"].to_i,
                  outdoor_session_params["end_time(2i)"].to_i,
                  outdoor_session_params["end_time(3i)"].to_i,
                  outdoor_session_params["end_time(4i)"].to_i,
                  outdoor_session_params["end_time(5i)"].to_i
                )
              else
                nil
              end

    # Find or create a challenge for the session's start year
    start_year = start_time.to_date.year
    challenge = current_user.challenges.find_or_create_by(year: start_year) do |new_challenge|
      new_challenge.start_date = Date.new(start_year, 1, 1)
      new_challenge.end_date = Date.new(start_year, 12, 31)
    end

    # Create the outdoor session
    @outdoor_session = challenge.outdoor_sessions.new(
      user_id: current_user.id,
      start_time: start_time,
      end_time: end_time,
      duration: end_time ? ((end_time - start_time) * 24).round(2) : nil,
      description: outdoor_session_params[:description]
    )

    if @outdoor_session.save
      redirect_to root_path, notice: "Outdoor session created successfully!"
    else
      redirect_to root_path, alert: @outdoor_session.errors.full_messages.to_sentence
    end
  end

  def update
    @outdoor_session = current_user.outdoor_sessions.find(params[:id])

    if params[:outdoor_session][:stop_timer] == "true"
      # Stop the timer
      end_time = Time.current
      duration = ((end_time - @outdoor_session.start_time) / 1.hour).round(2)
      description = params[:outdoor_session][:description]

      if @outdoor_session.update(end_time: end_time, duration: duration, description: description)
        flash[:notice] = "Outdoor session ended successfully!"
      else
        flash[:alert] = @outdoor_session.errors.full_messages.to_sentence
      end
    else
      # Regular update (if needed)
      if @outdoor_session.update(outdoor_session_params)
        flash[:notice] = "Outdoor session updated successfully!"
      else
        flash[:alert] = @outdoor_session.errors.full_messages.to_sentence
      end
    end

    redirect_to root_path
  end

  private

  def outdoor_session_params
    params.require(:outdoor_session).permit(
      :start_time, :end_time,
      "start_time(1i)", "start_time(2i)", "start_time(3i)", "start_time(4i)", "start_time(5i)",
      "end_time(1i)", "end_time(2i)", "end_time(3i)", "end_time(4i)", "end_time(5i)",
      :description, :manual_creation
    )
  end
end
