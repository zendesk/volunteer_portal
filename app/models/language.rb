class Language < ApplicationRecord
  has_many :user_preferences, dependent: :nullify
end
