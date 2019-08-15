class Organization < ApplicationRecord
  has_many :events, -> { order(:starts_at) }, dependent: :destroy, inverse_of: :organization

  validates :name, :description, :location, presence: true
end
