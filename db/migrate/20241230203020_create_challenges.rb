class CreateChallenges < ActiveRecord::Migration[8.0]
  def change
    create_table :challenges do |t|
      t.references :user, null: false, foreign_key: true # Foreign key to associate challenges with a user
      t.integer :year # Year of the challenge
      t.date :start_date # Start date of the challenge
      t.date :end_date # End date of the challenge
      t.decimal :total_time, precision: 10, scale: 2, default: 0.0 # Total time tracked for the challenge
      t.string :description # Optional field - ensure its use is clear

      t.timestamps # Adds created_at and updated_at columns
    end
  end
end
