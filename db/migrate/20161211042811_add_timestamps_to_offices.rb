class AddTimestampsToOffices < ActiveRecord::Migration[4.2]
  def change
    add_column :offices, :created_at, :datetime
    add_column :offices, :updated_at, :datetime
    add_index :offices, :updated_at
  end
end
