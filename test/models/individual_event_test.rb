require_relative '../test_helper'

SingleCov.covered! uncovered: 3 # not testing all pieces of the case because it isn't meaningful

describe IndividualEvent do
  fixtures :offices, :event_types, :organizations, :users

  let(:office) { offices(:san_francisco) }
  let(:type) { event_types(:individual) }
  let(:org) { organizations(:minimum) }
  let(:user) { users(:admin) }
  let(:tag) { tags(:minimum) }

  it 'creates individual event' do
    event = IndividualEvent.new(
      description: 'グループ',
      office: office,
      event_type: type,
      tags: [tag],
      organization: org,
      user: user,
      date: Time.zone.today,
      duration: 60
    )

    assert event.save, event.errors.full_messages
  end

  describe '.assign_tags' do
    it 'assigns a new tag' do
      event = IndividualEvent.new(
        description: 'グループ',
        office: office,
        event_type: type,
        tags: [],
        organization: org,
        user: user,
        date: Time.zone.today,
        duration: 60
      )
      event.assign_tags(tag)
      assert_equal 'Minimum Tag', event.tags.last.name
    end
  end

  describe '#to_status_enum' do
    it 'defaults to PENDING' do
      event = IndividualEvent.new

      event.to_status_enum.must_equal 'PENDING'
    end
  end
end
