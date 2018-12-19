import R from 'ramda'
import moment from 'moment'

export const MILESTONES = [
  { name: 1, hours: 4, color: '#358fb2' },
  { name: 2, hours: 8, color: '#5ebbde' },
  { name: 3, hours: 12, color: '#78cdec' },
]

export const signupsForEvent = (event, signups) => R.pickBy((s, _id) => s.eventId === event.id, signups)

export const signupsForEvents = (events, signups) => {
  const getSignups = event => signupsForEvent(event, signups)

  return R.pipe(
    R.map,
    R.map(R.values),
    R.flatten // eslint-disable-line comma-dangle
  )(getSignups, events)
}

export const signupsForUser = (user, signups) => R.pickBy((s, _id) => s.userId === user.id, signups)

export const eventsForUser = (user, signups, events) => {
  const userSignups = signupsForUser(user, signups)
  const eventIds = Object.values(userSignups).map(s => s.eventId)

  return R.pick(eventIds, events)
}

export const eventDurationsForUser = (signups, events, user) => {
  const userEvents = eventsForUser(user, signups, events)
  const durations = Object.values(userEvents).map(e => e.duration)
  const hours = Math.round(R.sum(durations) / 60)

  return Math.max(0, hours)
}

const adminRoleString = role => role.name === 'admin'
const userRoleString = role => role.name === 'volunteer'

export const adminRole = roles => R.find(adminRoleString)(Object.values(roles))
export const volunteerRole = roles => R.find(userRoleString)(Object.values(roles))

export const userIsAdmin = (user, roles) => {
  const admin = adminRole(roles)
  return user && admin && admin.id === user.roleId
}

export const pickMilestone = hours => {
  const finder = m => hours < m.hours
  const milestone = R.find(finder)(MILESTONES) || R.last(MILESTONES)

  return milestone
}

export const progressPercentage = (userHours, milestone) =>
  R.clamp(0, 100, Math.round(userHours / milestone.hours * 100))

function addStartAndEnd(event) {
  return R.merge(event, {
    start: new Date(event.time),
    end: new Date(
      moment(event.time)
        .add(event.duration, 'minutes')
        .format()
    ),
  })
}

export function normalizeEvents(events) {
  return R.map(addStartAndEnd, events)
}

export const filterByOffice = (collection, officeId) => {
  if (officeId === 'all') {
    return collection
  }
  return R.pickBy((item, _id) => item.officeId === officeId, collection)
}

export const present = v => !R.isNil(v) && !R.isEmpty(v)

export const validateForm = (validations, formObj) => {
  const errors = {}
  let valid = true

  R.forEachObjIndexed((options, field) => {
    const validField = R.apply(options.validate, [formObj[field]])
    valid = valid && validField

    if (!validField) {
      errors[field] = options.message || 'required'
    }
  }, validations)

  return { valid, errors }
}

export const defaultFilterMethod = (filter, row, column) =>
  R.contains(filter.value.toLowerCase(), String(row[filter.id]).toLowerCase())
