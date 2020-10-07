import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Link } from 'react-router'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

import EventLocation from 'components/EventLocation'
import EventTime from 'components/EventTime'
import LabeledProgress from 'components/LabeledProgress'
import Layout from 'components/Layout'
import Loading from 'components/LoadingIcon'
import SignupButton from 'components/SignupButton'
import UserList from 'components/UserList'

import EventQuery from './query.gql'
import CreateSignupMutation from 'mutations/CreateSignupMutation.gql'
import DestroySignupMutation from 'mutations/DestroySignupMutation.gql'

import s from './main.css'

import { useTranslation } from 'react-i18next'

let geocoder = null
try {
  geocoder = new google.maps.Geocoder()
} catch (e) {
  console.warn('Could not connect to google, address location disabled')
}

const Section = ({ title, children }) => (
  <div className={s.section}>
    <span className={s.sectionTitle}>{title}</span>
    {children}
  </div>
)

const AddToGoogleCalendar = ({ event }) => {
  const { t } = useTranslation()
  const formatDateTime = R.replace(/-|:/g, '')
  const {
    title,
    description,
    location,
    startsAt,
    endsAt,
    office: { timezone },
  } = event
  const templateUrl =
    'http://www.google.com/calendar/event?action=TEMPLATE' +
    `&text=${title}` +
    `&dates=${formatDateTime(startsAt)}/${formatDateTime(endsAt)}` +
    `&ctz=${timezone}` +
    `&details=${description}` +
    `&location=${location}`

  return (
    <a href={templateUrl} target="_blank" rel="nofollow noreferrer">
      {t('volunteer_portal.dashboard.layouttab.eventdetails.label.addtocalendar')}
    </a>
  )
}

// TODO: no local component state
class MapPreview extends Component {
  constructor(props) {
    super(props)
    // Default to the SF office
    this.state = {
      lat: 37.781773,
      lng: -122.410666,
    }

    this.geocodeCallback = this.geocodeCallback.bind(this)
  }

  componentDidMount() {
    if (geocoder) {
      geocoder.geocode({ address: this.props.event.location }, this.geocodeCallback)
    }
  }

  geocodeCallback(results, status) {
    if (google && status == google.maps.GeocoderStatus.OK) {
      this.setState({
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      })
    }
  }

  render() {
    const { lat, lng } = this.state

    const MapWithAMarker = withGoogleMap(() => {
      return (
        <GoogleMap defaultZoom={15} defaultCenter={{ lat, lng }} center={{ lat, lng }}>
          <Marker position={{ lat, lng }} defaultAnimation={2} />
        </GoogleMap>
      )
    })

    return (
      <MapWithAMarker
        containerElement={<div style={{ height: '200px', width: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
      />
    )
  }
}

const Event = ({ data: { loading, event, currentUser }, createSignup, destroySignup, locationBeforeTransitions }) => {
  if (loading) return <Loading />
  const { t } = useTranslation()

  return (
    <Layout currentPath={locationBeforeTransitions.pathname}>
      <div className={s.page}>
        <div className={s.pageHeader}>
          <Link to="/portal" className={s.pageNav}>
            {t('volunteer_portal.dashboard.layouttab.eventdetails.label.calendar')}
          </Link>
          <span className={s.pageTitle}>{event.title}</span>
        </div>
        <div className={s.detailsRow}>
          <div className={s.leftCol}>
            <Section title={t('volunteer_portal.dashboard.layouttab.eventdetails.label.overview')}>
              <div className={s.overview}>
                <div className={s.details}>
                  <span className={s.eventType}>{event.eventType.title}</span>
                  <p className={s.description}>{event.description}</p>
                </div>
                <div className={s.organization}>
                  <span className={s.orgTitle}>{event.organization.name}</span>
                  <p className={s.orgDescription}>{event.organization.description}</p>
                </div>
              </div>
            </Section>
          </div>
          <div className={s.rightCol}>
            <Section title={t('volunteer_portal.dashboard.layouttab.eventdetails.label.details')}>
              <EventLocation event={event} />
              <EventTime event={event} showDate />
              <MapPreview event={event} />
            </Section>
          </div>
        </div>
        <div className={s.row}>
          <div className={s.leftCol}>
            <Section title={t('volunteer_portal.dashboard.layouttab.eventdetails.label.attending')}>
              <div className={s.attendanceAndSignup}>
                <div className={s.attendanceProgress}>
                  <LabeledProgress
                    max={event.capacity}
                    value={event.users.length}
                    completedText={t('volunteer_portal.dashboard.layouttab.eventdetails.label.attending')}
                    remainingText={t('volunteer_portal.dashboard.layouttab.eventdetails.label.available')}
                  />
                </div>
                <div className={s.signupBtn}>
                  <SignupButton
                    currentUser={currentUser}
                    event={event}
                    createSignupHandler={() => createSignup(event, currentUser)}
                    destroySignupHandler={() => destroySignup(event, currentUser)}
                  />
                </div>
                <div className={s.capacityAnnotation}>
                  <span>
                    {t('volunteer_portal.dashboard.layouttab.eventdetails.label.capacity')} {event.capacity}
                  </span>
                </div>
              </div>
              <UserList users={event.users} />
            </Section>
          </div>
          <div className={s.rightCol}>
            <Section title={t('volunteer_portal.dashboard.layouttab.eventdetails.label.export')}>
              <AddToGoogleCalendar event={event} />
            </Section>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const withData = compose(
  graphql(EventQuery, {
    options: ({ params }) => ({
      variables: { id: params.eventId },
      fetchPolicy: 'cache-and-network',
    }),
  }),
  graphql(CreateSignupMutation, {
    props: ({ mutate }) => ({
      createSignup: (event, currentUser) =>
        mutate({
          variables: { eventId: event.id },
          optimisticResponse: {
            __typename: 'Mutation',
            createSignup: {
              __typename: 'Signup',
              event: R.merge(event, {
                users: R.append(currentUser, event.users),
              }),
            },
          },
        }),
    }),
  }),
  graphql(DestroySignupMutation, {
    props: ({ mutate }) => ({
      destroySignup: (event, currentUser) =>
        mutate({
          variables: { eventId: event.id, userId: currentUser.id },
          optimisticResponse: {
            __typename: 'Mutation',
            destroySignup: {
              __typename: 'Signup',
              event: R.merge(event, {
                users: R.reject(u => u.id === currentUser.id, event.users),
              }),
            },
          },
        }),
    }),
  })
)

const mapStateToProps = (state, ownProps) => {
  const { locationBeforeTransitions } = state.routing

  return {
    locationBeforeTransitions,
  }
}

export default connect(mapStateToProps)(withData(Event))
