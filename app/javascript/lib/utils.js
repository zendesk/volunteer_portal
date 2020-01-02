import * as R from 'ramda'

export const present = v => !R.isNil(v) && !R.isEmpty(v)

export const defaultFilterMethod = (filter, row, column) =>
  R.contains(filter.value.toLowerCase(), String(row[filter.id]).toLowerCase())
