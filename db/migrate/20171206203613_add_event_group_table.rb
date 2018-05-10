class AddEventGroupTable < ActiveRecord::Migration[5.1]
  def up
    create_table :event_groups do |t|
      t.string :title
      t.timestamps
    end

    add_column :events, :event_group_id, :integer
  end

  def down
    drop_table :event_groups

    remove_column :events, :event_group_id
  end
end
