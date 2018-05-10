class AddFollowUpEmailSentToEvents < ActiveRecord::Migration[4.2]
  def change
    add_column :events, :follow_up_email_sent_at, :datetime
  end
end
