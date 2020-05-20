class EventGroup < ApplicationRecord
  has_many :events

  # rubocop:disable Rails/UniqueValidationWithoutIndex
  validates :title, presence: true, uniqueness: true
  # rubocop:enable Rails/UniqueValidationWithoutIndex
end
