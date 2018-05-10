class BackfillSoftDeletedIndividualEvents < ActiveRecord::Migration[5.1]
  def up
    IndividualEvent.unscoped.find_each do |ie|
      user = User.with_deleted { User.find(ie.user_id) }
      IndividualEvent.soft_delete!(validate: false) if user.deleted?
    end
  end

  def down
  end
end
