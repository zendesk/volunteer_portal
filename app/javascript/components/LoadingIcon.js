import React from 'react'
import * as R from 'ramda'
import { Spinner } from '@zendeskgarden/react-loaders'

const ownStyles = {
  loading: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}

const LoadingIcon = ({ style }) => <Spinner size="120" color={'#30aabc'} style={R.merge(ownStyles.loading, style)} />

export default LoadingIcon
