# rubocop:disable Rails/BulkChangeTable

class AddGoogleTokenToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :encrypted_google_token, :string
    add_column :users, :encrypted_google_token_iv, :string
  end
end
# rubocop:enable Rails/BulkChangeTable
