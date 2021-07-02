class AddLanguageToUserPreference < ActiveRecord::Migration[5.2]
  def change
    add_column :user_preferences, :language_id, :bigint, default: 1
    add_foreign_key :user_preferences, :languages
  end
end
