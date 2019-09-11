class AssociateEventsWithOffice < ActiveRecord::Migration[4.2]
  def change
    sf = Office.find_by(name: 'San Francisco')
    raise 'the SF office must exist before adding office_id to events' unless sf.try(:id)

    add_column :events, :office_id, :integer, null: false, index: true, default: sf.id
  end
end
