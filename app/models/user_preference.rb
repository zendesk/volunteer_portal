class UserPreference < ApplicationRecord
  belongs_to :user
  belongs_to :language

  scope :for_user, ->(user) { where(user: user) }
end
