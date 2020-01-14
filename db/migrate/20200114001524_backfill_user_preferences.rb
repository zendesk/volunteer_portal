class BackfillUserPreferences < ActiveRecord::Migration[5.1]
  def up
    User.find_each do |u|
      UserPreference.find_or_create_by(user_id: u.id) do |preference|
        preference.confirmed_profile_settings = true
      end
    end
  end

  def down
    UserPreference.delete_all
  end
end
