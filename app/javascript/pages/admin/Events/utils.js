import * as R from 'ramda'

export const extractIdFromAssociations = values =>
  R.map(value => {
    if (R.type(value) === 'Object' && R.has('id', value)) {
      return R.pick(['id'], value)
    } else if (R.type(value) === 'Array' && R.all(R.hasPath(['id']))(value)) {
      return R.map(R.pick(['id']), value)
    } else {
      return value
    }
  }, values)
