import React, { Component, useEffect } from 'react'
import * as R from 'ramda'
import { compose, graphql } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import { connect } from 'react-redux'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

import App from 'components/App'

import { togglePopover } from 'actions'

import AppQuery from './query.gql'

// TODO refactor it into AppPage as a functional component
const MomentLocale = ({ children }) => {
  const { i18n } = useTranslation()
  useEffect(() => {
    moment.locale(i18n.language)
  }, [i18n.language])
  return <>{children}</>
}

class AppPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      data: { networkStatus, currentUser, offices },
      togglePopover,
      popover,
      children,
    } = this.props

    return (
      <MomentLocale>
        <App
          loading={networkStatus === NetworkStatus.loading}
          currentUser={currentUser}
          offices={offices}
          userPopover={popover && popover.type === 'user' ? popover : null}
          toggleUserPopover={R.partial(togglePopover, ['user', {}])}
        >
          {children}
        </App>
      </MomentLocale>
    )
  }
}

const mapStateToProps = (state, { children }) => {
  const { popover } = state.model

  return {
    popover,
    children,
  }
}

const withData = compose(
  graphql(AppQuery, {
    options: {
      fetchPolicy: 'cache-and-network',
    },
  })
)

const withActions = connect(mapStateToProps, {
  togglePopover,
})

export default withActions(withData(AppPage))
