class AssociateUserWithOffice < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :office_id, :integer, index: true
  end
end
