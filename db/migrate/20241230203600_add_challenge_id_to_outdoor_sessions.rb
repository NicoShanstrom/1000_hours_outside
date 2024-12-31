class AddChallengeIdToOutdoorSessions < ActiveRecord::Migration[8.0]
  def change
    # Step 1: Add the column without the NOT NULL constraint
    add_reference :outdoor_sessions, :challenge, foreign_key: true

    # Step 2: Backfill data for existing records
    OutdoorSession.reset_column_information

    # Create a default challenge for 2024 if it doesn't exist
    default_challenge = Challenge.create!(
      user_id: User.first.id, # Adjust as needed for your logic
      year: 2024,
      start_date: Date.new(2024, 1, 1),
      end_date: Date.new(2024, 12, 31),
      total_time: 0.0,
      description: "Default 2024 Challenge"
    )

    # Associate all existing outdoor sessions with the default challenge
    OutdoorSession.update_all(challenge_id: default_challenge.id)

    # Step 3: Change the column to enforce the NOT NULL constraint
    change_column_null :outdoor_sessions, :challenge_id, false
  end
end
