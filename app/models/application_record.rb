class ApplicationRecord < ActiveRecord::Base
  DEFAULT_TIMEZONE = 'America/Los_Angeles'.freeze

  self.abstract_class = true
end
