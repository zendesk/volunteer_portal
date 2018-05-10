class EventGroup < ApplicationRecord
  has_many :events

  validates :title, presence: true, uniqueness: true
end
