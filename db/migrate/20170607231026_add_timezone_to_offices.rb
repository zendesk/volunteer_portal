class AddTimezoneToOffices < ActiveRecord::Migration[5.0]
  def change
    add_column :offices, :timezone, :string
  end
end
