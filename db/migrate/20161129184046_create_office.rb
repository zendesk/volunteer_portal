class CreateOffice < ActiveRecord::Migration[4.2]
  def change
    create_table :offices do |t|
      t.string :name, null: false
      t.string :identifier, null: false
    end
  end
end
