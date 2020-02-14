import React, { useContext } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import * as R from 'ramda'

import EventForm from './form'
import { extractIdFromAssociations } from './utils'

import EventsQuery from './queries/index.gql'
import EventQuery from './queries/show.gql'
import CreateEventMutation from './mutations/create.gql'
import { FilterContext, officeFilterValueLens } from '/context'

import Loading from 'components/LoadingIcon'

const eventsSort = 'STARTS_AT_DESC'

const transformToReduxFormState = event => {
  const { title, description, capacity, location, startsAt, endsAt, eventType, tags, office, organization } = event
  return {
    title,
    description,
    location,
    capacity,
    startsAt: new Date(startsAt),
    endsAt: new Date(endsAt),
    eventType: R.pick(['id'], eventType || {}),
    tags,
    office: R.pick(['id'], office || {}),
    organization: R.pick(['id'], organization || {}),
  }
}

const NewEvent = ({ router, params }) => {
  const { filters, setOfficeValue } = useContext(FilterContext)
  const { data, loading } = useQuery(EventQuery, { variables: { id: R.propOr('-1', 'id', params) } })
  const [createEvent] = useMutation(CreateEventMutation, {
    update: (proxy, { data: { createEvent } }) => {
      const queryParams = {
        query: EventsQuery,
        variables: {
          officeId: R.view(officeFilterValueLens, filters),
          sortBy: eventsSort,
        },
      }
      const result = proxy.readQuery(queryParams)
      const withNewEvent = R.append(createEvent, result.events)
      proxy.writeQuery({
        ...queryParams,
        data: { ...result, events: withNewEvent },
      })
    },
  })

  const onSubmit = event => {
    createEvent({
      variables: { input: extractIdFromAssociations(event) },
    }).then(({ data }) => {
      setOfficeValue(R.path(['createEvent', 'office', 'id'], data))
      router.push('/portal/admin/events')
    })
  }

  if (loading) return <Loading />

  const event = R.prop('event', data)

  return (
    <EventForm
      event={event && transformToReduxFormState(event)}
      tags={R.propOr([], 'tags', data)}
      eventTypes={R.propOr([], 'eventTypes', data)}
      offices={R.propOr([], 'offices', data)}
      organizations={R.propOr([], 'organizations', data)}
      onSubmit={onSubmit}
    />
  )
}

export default NewEvent
