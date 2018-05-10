class AddSoftDeleteToIndividualEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :individual_events, :deleted_at, :datetime
  end
end
