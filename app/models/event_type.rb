class EventType < ApplicationRecord
  has_many :events, dependent: :nullify

  validates :title, presence: true
end
