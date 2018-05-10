import React from 'react'
import Calendar from './'
import { shallow } from 'enzyme'

const currentUser = {
  id: '1',
  name: 'Craig Day',
  email: 'volunteer@example.com',
  photo: 'https://example.com/photo.jpg',
  isAdmin: true,
  office: {
    id: '1',
    identifier: 'san_francisco',
    name: 'San Francisco',
  },
}

const events = []
const offices = []

const filters = {
  showFilter: {},
  eventFilter: {},
  officeFilter: {},
}

const changeShowFilter = () => {}
const changeEventFilter = () => {}
const changeOfficeFilter = () => {}
const eventPopover = {}
const togglePopover = () => {}
const loadMoreEvents = () => {}

test('loads', () => {
  const component = shallow(
    <Calendar
      loading={false}
      currentPath={'/'}
      events={events}
      offices={offices}
      currentUser={currentUser}
      filters={filters}
      changeShowFilter={changeShowFilter}
      changeEventFilter={changeEventFilter}
      changeOfficeFilter={changeOfficeFilter}
      eventPopover={eventPopover}
      togglePopover={togglePopover}
      loadMoreEvents={loadMoreEvents}
    />
  )

  expect(component).toMatchSnapshot()
})
