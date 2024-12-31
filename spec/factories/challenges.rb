FactoryBot.define do
  factory :challenge do
    user { nil } # This will associate the challenge with no user by default. You can override this in specific tests.
    year { 2024 } # Replace with a realistic default year or dynamically generate it.
    start_date { Date.today.beginning_of_year } # Example: January 1st of the current year.
    end_date { Date.today.end_of_year } # Example: December 31st of the current year.
    total_time { 0.0 } # Default total time is zero.
  end
end
