class CreateOrganizations < ActiveRecord::Migration[4.2]
  def change
    create_table :organizations do |t|
      t.string :name
      t.text :description
      t.string :location
      t.string :website

      t.timestamps
    end
  end
end
