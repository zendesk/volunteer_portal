import React from 'react'
import moment from 'moment'
import R from 'ramda'
import BigCalendar from 'react-big-calendar'

import Event from 'components/Event'
import Layout from 'components/Layout'
import Loading from 'components/LoadingIcon'
import Toolbar from 'components/Toolbar'

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
        events={normalizeEvents(events)}
        eventPropGetter={eventPropGetter}
        views={['month']}
        culture="en"
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

export default Calendar
