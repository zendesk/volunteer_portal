class EventType < ApplicationRecord
  has_soft_deletion default_scope: false
  has_many :events, dependent: :nullify

  validates :title, presence: true
end
