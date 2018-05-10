class ChangeApprovalToStatus < ActiveRecord::Migration[5.1]
  def up
    add_column :individual_events, :status, :integer, limit: 1, null: false, default: 0
    remove_column :individual_events, :approved
  end

  def down
    add_column :individual_events, :approved, :boolean, default: false
    remove_column :individual_events, :status
  end
end
