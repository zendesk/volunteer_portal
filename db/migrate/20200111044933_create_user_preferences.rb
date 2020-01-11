class CreateUserPreferences < ActiveRecord::Migration[5.1]
  def change
    create_table :user_preferences do |t|
      t.boolean    :confirmedProfileSettings, null: false, default: false
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
