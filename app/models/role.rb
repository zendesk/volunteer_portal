class Role < ApplicationRecord
  MAPPING = {
    1 => 'admin',
    2 => 'volunteer',
  }.freeze

  def self.admin
    find_by(name: MAPPING[1]) || create!(name: MAPPING[1])
  end

  def self.volunteer
    find_by(name: MAPPING[2]) || create!(name: MAPPING[2])
  end
end
