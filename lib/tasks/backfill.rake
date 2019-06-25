namespace :backfill do
  desc "Backfill the duration field for events"
  task duration: :environment do
    ActiveRecord::Base.transaction do
      Event.where(duration:nil).each do |e|
        e.update! duration: (e.ends_at - e.starts_at) / 60
      end
    end
  end
end
