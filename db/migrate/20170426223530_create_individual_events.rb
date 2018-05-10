class CreateIndividualEvents < ActiveRecord::Migration[5.0]
  def change
    create_table :individual_events do |t|
      t.references :user,         null: false
      t.references :organization, null: false
      t.references :event_type,   null: false
      t.references :office,       null: false
      t.integer    :duration,     null: false
      t.text       :description
      t.date       :date,         null: false
      t.boolean    :approved,     null: false, default: false

      t.timestamps
    end
  end
end
