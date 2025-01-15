class Challenge < ApplicationRecord
  belongs_to :user
  has_many :outdoor_sessions, dependent: :destroy

  validates :year, presence: true, numericality: { only_integer: true }, uniqueness: { scope: :user_id }
  validates :start_date, :end_date, presence: true

  # Calculate total time from associated outdoor sessions
  def total_time
    outdoor_sessions.sum(:duration).round(2)
  end
end
