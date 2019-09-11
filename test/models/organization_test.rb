require_relative '../test_helper'

SingleCov.covered!

describe Organization do
  fixtures :organizations, :offices

  let(:sf) { offices(:san_francisco) }

  it 'creates organization' do
    organization = Organization.new(
      name: '犬', description: 'Save all them dogs.', location: 'San Francisco'
    )
    assert organization.save
  end

  it 'adds events to organization' do
    organization = organizations(:kittens)

    assert_difference('organization.events.count', 1) do
      organization.events << Event.new(
        title: 'イベント', type: event_types(:group), starts_at: Time.zone.now, ends_at: (Time.zone.now + 2.hours), capacity: 60,
        location: 'Location', office: sf
      )
      assert organization.save
    end
  end

  it 'presents events in order' do
    event_future = Event.new(
      title: 'Deploy', type: event_types(:group), starts_at: Time.zone.now + 10.days, ends_at: (Time.zone.now + 10.days + 2.hours),
      capacity: 60, location: 'Location', office: sf
    )
    event_now = Event.new(
      title: 'Test', type: event_types(:group), starts_at: Time.zone.now, ends_at: (Time.zone.now + 2.hours), capacity: 60,
      location: 'Location', office: sf
    )
    organization = organizations(:kittens)
    organization.events.destroy_all
    organization.events << [event_future, event_now]
    organization.save
    organization.events.reload

    assert_equal [event_now, event_future], organization.events
  end
end
