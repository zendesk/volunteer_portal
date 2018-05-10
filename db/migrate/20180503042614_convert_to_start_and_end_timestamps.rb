class ConvertToStartAndEndTimestamps < ActiveRecord::Migration[5.1]
  def up
    add_column :events, :starts_at, :datetime
    add_column :events, :ends_at, :datetime

    Event.connection.execute(
      <<-SQL
        UPDATE "events"
        SET
          "starts_at" = "time",
          "ends_at" = "time" + (interval '1 minute' * "duration")
      SQL
    )
  end

  def down
    remove_column :events, :starts_at
    remove_column :events, :ends_at
  end
end
