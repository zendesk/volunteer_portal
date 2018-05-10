import React from 'react'
import R from 'ramda'
import CircularProgress from 'material-ui/CircularProgress'

const ownStyles = {
  loading: {
    left: '50%',
    marginLeft: -60,
    stroke: '#30aabc',
  },
}

const LoadingIcon = ({ style }) => (
  <CircularProgress size={120} thickness={5} color="30aabc" style={R.merge(ownStyles.loading, style)} />
)

export default LoadingIcon
