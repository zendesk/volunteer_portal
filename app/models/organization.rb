class Organization < ApplicationRecord

  has_many :events, -> { order(:starts_at) }, dependent: :destroy

  validates_presence_of :name, :description, :location
end
