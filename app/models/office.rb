class Office < ApplicationRecord
  DEFAULT_NAME = 'Remote'.freeze

  before_validation :ensure_identifier, on: [:create, :update]
  before_save :trim_name

  validates :name, :identifier, presence: true, uniqueness: true

  has_many :events
  has_many :users

  def self.default
    find_by(name: DEFAULT_NAME) || create!(name: DEFAULT_NAME)
  end

  private

  def ensure_identifier
    self.identifier = identifier.presence || name_to_identifier
  end

  def trim_name
    self.name = name.strip
  end

  def name_to_identifier
    name.strip.downcase.gsub(' ', '_').squeeze(' ')
  end
end
