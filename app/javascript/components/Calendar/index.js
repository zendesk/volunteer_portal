import React from 'react'
import BigCalendar from 'react-big-calendar'
import R from 'ramda'
import moment from 'moment'

import Loading from 'components/LoadingIcon'
import Layout from 'components/Layout'
import Toolbar from 'components/Toolbar'
import Event from 'components/Event'
import { withNamespaces } from 'react-i18next'

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
const calendarComponents = (currentUser, offices, filters, filterActions, t) => {
  const { changeShowFilter, changeEventFilter, changeOfficeFilter } = filterActions

  const showFilter = {
    value: filters.showFilter.value,
    onChange: changeShowFilter,
  }

  const eventFilter = {
    value: filters.eventFilter.value,
    onChange: changeEventFilter,
  }

  const officeFilter = {
    value: filters.officeFilter.value || currentUser.office.id,
    onChange: changeOfficeFilter,
  }

  return {
    toolbar: props => (
      <Toolbar
        {...props}
        offices={offices}
        showFilter={showFilter}
        eventFilter={eventFilter}
        officeFilter={officeFilter}
      />
    ),
    event: Event, // used by each view (Month, Day, Week)
  }
}

const eventPropGetter = (event, start, end, isSelected) => ({
  style: styles.cell,
})

// Filter pipeline for selecting events to display on the calendar
const normalizeEvents = events =>
  R.map(
    event =>
      R.merge(event, {
        start: new Date(event.startsAt),
        end: new Date(event.endsAt),
      }),
    events
  )

const applyShowFilter = dataAndFilters => {
  const {
    event,
    currentUser,
    filters: { showFilter },
    isValid,
  } = dataAndFilters

  if (isValid) {
    switch (showFilter.value) {
      case 'mine':
        return R.merge(dataAndFilters, { isValid: R.any(user => user.id === currentUser.id)(event.users) })
      default:
        return dataAndFilters
    }
  } else {
    return dataAndFilters
  }
}

const applyEventFilter = dataAndFilters => {
  const {
    event,
    currentUser,
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
        return dataAndFilters
    }
  } else {
    return dataAndFilters
  }
}

const applyOfficeFilter = dataAndFilters => {
  const {
    event,
    currentUser,
    filters: { officeFilter },
    isValid,
  } = dataAndFilters

  if (isValid) {
    switch (officeFilter.value) {
      case 'all':
        return dataAndFilters
      default:
        return R.merge(dataAndFilters, { isValid: event.office.id == (officeFilter.value || currentUser.office.id) })
    }
  } else {
    return dataAndFilters
  }
}

const filterPipeline = ({ currentUser, filters, isValid }, event) =>
  R.pipe(
    applyShowFilter,
    applyEventFilter,
    applyOfficeFilter
  )({
    event,
    currentUser,
    filters,
    isValid,
  }).isValid

const selectEvents = (events, currentUser, filters) =>
  R.pipe(
    R.filter,
    R.values,
    normalizeEvents
  )(R.partial(filterPipeline, [{ currentUser, filters, isValid: true }]), events)

const Calendar = ({
  loading,
  currentPath,
  events,
  offices,
  currentUser,
  filters,
  changeShowFilter,
  changeEventFilter,
  changeOfficeFilter,
  eventPopover,
  togglePopover,
  loadMoreEvents,
  createSignup,
  destroySignup,
  t,
}) =>
  loading ? (
    <Loading />
  ) : (
    <Layout currentPath={currentPath}>
      <BigCalendar
        events={selectEvents(events, currentUser, filters)}
        eventPropGetter={eventPropGetter}
        views={['month']}
        culture="en"
        components={calendarComponents(
          currentUser,
          offices,
          filters,
          {
            changeShowFilter,
            changeEventFilter,
            changeOfficeFilter,
          },
          t
        )}
        onSelectEvent={(event, e) => togglePopover('event', event, e.currentTarget)}
        onNavigate={loadMoreEvents}
        popup
        style={{ paddingBottom: 20 }}
      />
    </Layout>
  )

export default withNamespaces()(Calendar)
