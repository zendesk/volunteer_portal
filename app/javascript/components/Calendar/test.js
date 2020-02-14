import React from 'react'
import Calendar from './'
import { UserContextProvider, FilterContextProvider } from '/context'
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
const eventPopover = {}
const togglePopover = () => {}
const loadMoreEvents = () => {}

test('loads', () => {
  const component = shallow(
    <UserContextProvider user={currentUser}>
      <FilterContextProvider user={currentUser}>
        <Calendar
          loading={false}
          currentPath={'/'}
          events={events}
          eventPopover={eventPopover}
          togglePopover={togglePopover}
          loadMoreEvents={loadMoreEvents}
        />
      </FilterContextProvider>
    </UserContextProvider>
  )

  expect(component).toMatchSnapshot()
})
