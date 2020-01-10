class AddSoftDeleteToEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :events, :deleted_at, :datetime
  end
end
