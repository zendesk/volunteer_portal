import React from 'react'
import moment from 'moment'
import * as R from 'ramda'
import BigCalendar from 'react-big-calendar'

import Event from 'components/Event'
import Layout from 'components/Layout'
import Loading from 'components/LoadingIcon'
import Toolbar from 'components/Toolbar'

import 'style-loader!css-loader!react-big-calendar/lib/css/react-big-calendar.css'
import i18next from 'i18next'
import { withTranslation } from 'react-i18next'

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
const calendarComponents = (currentUser, offices, filters, filterActions) => {
  const filtersWithActions = {
    showFilter: {
      value: filters.showFilter.value,
      onChange: filterActions.changeShowFilter,
    },
    eventFilter: {
      value: filters.eventFilter.value,
      onChange: filterActions.changeEventFilter,
    },
    officeFilter: {
      value: filters.officeFilter.value || currentUser.office.id,
      onChange: filterActions.changeOfficeFilter,
    },
  }

  return {
    toolbar: props => <Toolbar {...props} offices={offices} filters={filtersWithActions} />,
    event: Event, // used by each view (Month, Day, Week)
  }
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
        dataAndFilters
    }
  }

  return dataAndFilters
}

const applyOfficeFilter = dataAndFilters => {
  const {
    event,
    currentUser,
    filters: { officeFilter },
    isValid,
  } = dataAndFilters
  const showAll = officeFilter.value === 'all'

  if (isValid && !showAll) {
    return R.merge(dataAndFilters, { isValid: event.office.id == (officeFilter.value || currentUser.office.id) })
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
  togglePopover,
  loadMoreEvents,
}) =>
  loading ? (
    <Loading />
  ) : (
    <Layout currentPath={currentPath}>
      <BigCalendar
        events={selectEvents(events, currentUser, filters)}
        eventPropGetter={eventPropGetter}
        views={['month']}
        culture={i18next.language}
        components={calendarComponents(currentUser, offices, filters, {
          changeShowFilter,
          changeEventFilter,
          changeOfficeFilter,
        })}
        onSelectEvent={(event, e) => togglePopover('event', event, e.currentTarget)}
        onNavigate={loadMoreEvents}
        popup
        style={{ paddingBottom: 20 }}
      />
    </Layout>
  )

// Wrap `withNamespaces` to listen to language change event
export default withTranslation()(Calendar)
