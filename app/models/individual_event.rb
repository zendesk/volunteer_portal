class IndividualEvent < ApplicationRecord
  REJECTED = -1
  PENDING = 0
  APPROVED = 1

  has_soft_deletion default_scope: true

  belongs_to :user
  belongs_to :organization
  belongs_to :event_type
  belongs_to :office

  has_many :individual_event_tags
  has_many :tags, through: :individual_event_tags

  validates :user, :organization, :event_type, :office,
            :description, :date, presence: true
  validates :duration, numericality: {
    only_integer: true,
    greater_than: 0
  }

  scope :for_user, ->(user) { where(user: user) }
  scope :before,   ->(date) { where("date < ?", date) }
  scope :after,    ->(date) { where("date > ?", date) }
  scope :pending,  -> { where(status: PENDING) }
  scope :approved, -> { where(status: APPROVED) }

  def to_status_enum
    case status
    when REJECTED then 'REJECTED'
    when PENDING then 'PENDING'
    when APPROVED then 'APPROVED'
    else 'PENDING'
    end
  end
end
