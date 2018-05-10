class FixUsersTeamsDepartmentsGroups < ActiveRecord::Migration[5.1]
  def up
    if column_exists?(:users, :department)
      rename_column :users, :department, :group
    else
      add_column :users, :group, :string
    end

    remove_column :users, :team
  end

  def down
    remove_column :users, :group
    add_column :users, :department, :string
    add_column :users, :team, :string
  end
end
