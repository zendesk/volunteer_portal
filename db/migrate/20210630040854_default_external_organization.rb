class DefaultExternalOrganization < ActiveRecord::Migration[5.2]
  def change
    Organization.where(name: 'External Volunteering', description: 'A default option for unlisted organization', location: 'N/A').first_or_create
  end
end
