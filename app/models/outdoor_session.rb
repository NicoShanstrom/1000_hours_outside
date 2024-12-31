class OutdoorSession < ApplicationRecord
  belongs_to :user
  belongs_to :challenge

  validates :start_time, presence: true
  validates :end_time, presence: true, on: :update
  validates :duration, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  validate :end_time_after_start_time

  before_save :calculate_duration, if: -> { start_time.present? && end_time.present? }

  scope :for_challenge, ->(challenge) { where(challenge_id: challenge.id) }

  private

  def end_time_after_start_time
    if end_time.present? && start_time.present? && end_time <= start_time
      errors.add(:end_time, "must be later than the start time of the session.")
    end
  end

  def calculate_duration
    if end_time && start_time && end_time > start_time
      self.duration = ((end_time - start_time) / 1.hour).round(2)
    else
      self.duration = 0
    end
  end
end
