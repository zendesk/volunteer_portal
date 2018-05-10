class InsertSfOffice < ActiveRecord::Migration[4.2]
  def up
    Office.find_or_create_by!(name: 'San Francisco')
  end
end
