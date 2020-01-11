class UserPreference < ApplicationRecord
  belongs_to :user

  scope :for_user, ->(user) { where(user: user) }
end