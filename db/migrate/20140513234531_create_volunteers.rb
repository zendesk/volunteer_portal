class CreateVolunteers < ActiveRecord::Migration[4.2]
  def change
    create_table :volunteers do |t|
      t.text :name
      t.text :email

      t.timestamps
    end
  end
end
