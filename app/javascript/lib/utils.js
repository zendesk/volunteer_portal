import R from 'ramda'

export const defaultFilterMethod = (filter, row, column) =>
  R.contains(filter.value.toLowerCase(), String(row[filter.id]).toLowerCase())
