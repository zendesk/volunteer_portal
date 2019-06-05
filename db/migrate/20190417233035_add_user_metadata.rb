class AddUserMetadata < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :metadata, :jsonb
  end
end
