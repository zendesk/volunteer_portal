import React from 'react'
import { Link } from 'react-router'
import * as R from 'ramda'
import Popover from 'material-ui/Popover'

import EventLocation from 'components/EventLocation'
import EventTime from 'components/EventTime'
import AvatarGroup from 'components/AvatarGroup'
import SignupButton from 'components/SignupButton'
import Blackout from 'components/Blackout'

import s from './main.css'

import { useTranslation } from 'react-i18next'

// Material UI components still require inline styles
const styles = {
  popover: {
    marginTop: 5,
    fontWeight: 400,
  },
}

const renderEventDescription = event =>
  event.description.length > 255 ? `${event.description.slice(0, 256)}...` : event.description

const photoUrls = users => users.map(u => u.photo)

const renderAdditionalCountAvatar = users =>
  users.length > 3 ? (
    <figure className={s.figure}>
      <svg className={s.svg}>
        <circle r="25" cx="25" cy="25" className={s.circle} />
      </svg>
      <span className={s.text}>{`+${users.length - 3}`}</span>
    </figure>
  ) : null

const EventProperties = ({ event }) =>
  event ? (
    <div>
      <p className={s.description}>
        <span className={s.eventTitle}>{event.title}</span>
        <span className={s.eventType}>{event.eventType.title || 'General'}:</span>
        {renderEventDescription(event)}
      </p>
      <EventLocation event={event} />
      <EventTime event={event} />
    </div>
  ) : (
    <div>
      <p className={s.description}>
        <span className={s.eventTitle}>
          <Blackout width={8} />
        </span>
        <span className={s.eventType}>
          <Blackout width={5} />
        </span>
        <Blackout width={10} />
      </p>
      <Blackout width={8} />
      <p />
      <Blackout width={8} />
    </div>
  )

const AttendeeIcons = ({ event }) =>
  event ? (
    <div className={s.attendeeIcons}>
      <AvatarGroup maxAvatars={3} images={photoUrls(event.users)} />
      {renderAdditionalCountAvatar(event.users)}
      <span className={s.spotsAvailable}>{event.capacity - event.users.length}</span>
    </div>
  ) : (
    <div className={s.attendeeIcons}>
      <AvatarGroup maxAvatars={3} images={[null, null]} />
      <span className={s.spotsAvailable}>
        <Blackout width={3} />
      </span>
    </div>
  )

const Actions = ({ event, currentUser, createSignupHandler, destroySignupHandler, t }) =>
  event ? (
    <div className={s.container}>
      <Link to={`/portal/events/${event.id}`}>
        <button className={s.btn}>{t('volunteer_portal.dashboard.layouttab.eventpopover.button.details')}</button>
      </Link>
      <SignupButton
        currentUser={currentUser}
        event={event}
        createSignupHandler={createSignupHandler}
        destroySignupHandler={destroySignupHandler}
      />
    </div>
  ) : (
    <div className={s.container}>
      <button className={s.btn} disabled>
        {t('volunteer_portal.dashboard.layouttab.eventpopover.button.details')}
      </button>
      <button className={s.btn} disabled>
        {t('volunteer_portal.dashboard.layouttab.eventpopover.button.signup')}
      </button>
    </div>
  )

const EventPopover = ({
  open,
  anchorEl,
  currentUser,
  event,
  onPopoverClose,
  createSignupHandler,
  destroySignupHandler,
}) => {
  const { t } = useTranslation()
  return (
    <Popover
      style={styles.popover}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
      targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
      onRequestClose={() => onPopoverClose('event')}
    >
      <div className={s.popover}>
        <button className={s.closePopover} onClick={() => onPopoverClose('event')}>
          ×
        </button>
        <EventProperties event={event} />
        <div className={s.attendeeInfo}>
          <div style={{ overflow: 'hidden' }}>
            <span className={s.attending}>
              {t('volunteer_portal.dashboard.layouttab.eventpopover.label.attending')}
            </span>
            <span className={s.availableSpots}>
              {t('volunteer_portal.dashboard.layouttab.eventpopover.label.availablespots')}
            </span>
          </div>
          <AttendeeIcons event={event} />
        </div>
        <Actions
          event={event}
          currentUser={currentUser}
          createSignupHandler={createSignupHandler}
          destroySignupHandler={destroySignupHandler}
          t={t}
        />
      </div>
    </Popover>
  )
}

export default EventPopover
