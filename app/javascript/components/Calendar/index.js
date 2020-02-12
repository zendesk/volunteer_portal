import React, { useContext } from 'react'
import moment from 'moment'
import * as R from 'ramda'
import BigCalendar from 'react-big-calendar'

import Event from 'components/Event'
import Layout from 'components/Layout'
import Loading from 'components/LoadingIcon'
import Toolbar from 'components/Toolbar'
import { FilterContext, UserContext } from '/context'

import 'style-loader!css-loader!react-big-calendar/lib/css/react-big-calendar.css'

const localizer = BigCalendar.momentLocalizer(moment)
BigCalendar.setLocalizer(localizer)

// BigCalendar needs inline styles :(
const styles = {
  cell: {
    backgroundColor: 'transparent',
    color: '#555',
  },
}

// Custom components given to BigCalendar
const calendarComponents = {
  toolbar: props => <Toolbar {...props} />,
  event: Event, // used by each view (Month, Day, Week)
}

const eventPropGetter = (_event, _start, _end, _isSelected) => ({
  style: styles.cell,
})

// Filter pipeline for selecting events to display on the calendar
const normalizeEvents = R.map(event =>
  R.merge(event, {
    start: new Date(event.startsAt),
    end: new Date(event.endsAt),
  })
)

const applyShowFilter = dataAndFilters => {
  const {
    event,
    currentUser,
    filters: { showFilter },
    isValid,
  } = dataAndFilters

  if (isValid && showFilter.value == 'mine') {
    return R.merge(dataAndFilters, { isValid: R.any(user => user.id === currentUser.id, event.users) })
  }

  return dataAndFilters
}

const applyEventFilter = dataAndFilters => {
  const {
    event,
    filters: { eventFilter },
    isValid,
  } = dataAndFilters

  if (isValid) {
    switch (eventFilter.value) {
      case 'open':
        return R.merge(dataAndFilters, { isValid: event.users.length < event.capacity })
      case 'full':
        return R.merge(dataAndFilters, { isValid: event.users.length >= event.capacity })
      default:
        dataAndFilters
    }
  }

  return dataAndFilters
}

const applyOfficeFilter = dataAndFilters => {
  const {
    event,
    filters: { officeFilter },
    isValid,
  } = dataAndFilters
  const showAll = officeFilter.value === 'all'

  if (isValid && !showAll) {
    return R.merge(dataAndFilters, { isValid: event.office.id == officeFilter.value })
  }

  return dataAndFilters
}

const filterPipeline = (currentUser, filters, isValid) =>
  R.pipe(
    event => ({ event, currentUser, filters, isValid }),
    applyShowFilter,
    applyEventFilter,
    applyOfficeFilter,
    R.prop('isValid')
  )

const selectEvents = (events, currentUser, filters) =>
  R.pipe(
    R.filter(filterPipeline(currentUser, filters, true)),
    R.values,
    normalizeEvents
  )(events)

const Calendar = ({ loading, currentPath, events, togglePopover, loadMoreEvents }) => {
  const { currentUser } = useContext(UserContext)
  const { filters } = useContext(FilterContext)

  if (loading) return <Loading />

  return (
    <Layout currentPath={currentPath}>
      <BigCalendar
        events={selectEvents(events, currentUser, filters)}
        eventPropGetter={eventPropGetter}
        views={['month']}
        culture="en"
        components={calendarComponents}
        onSelectEvent={(event, e) => togglePopover('event', event, e.currentTarget)}
        onNavigate={loadMoreEvents}
        popup
        style={{ paddingBottom: 20 }}
      />
    </Layout>
  )
}

export default Calendar
