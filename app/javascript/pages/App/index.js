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

// TODO refactor it into AppPage as a functional component // todo: change name
const RemoteLocale = ({ children, currentUser, languages }) => {
  const { i18n } = useTranslation()

  useEffect(() => {
    const languageId = R.pipe(R.prop('preference'), R.prop('languageId'))(currentUser)

    if (!R.isNil(languageId)) {
      const chosenLanguage = R.find(R.propEq('id', languageId))(languages)
      const languageCode = R.prop('languageCode', chosenLanguage)
      i18n.changeLanguage(languageCode, () => {
        // TODO: Handle callback (error/success)
      })
      moment.locale(languageCode)
    }
  }, [currentUser])

  return <>{children}</>
}

class AppPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      data: { networkStatus, currentUser, offices, languages },
      togglePopover,
      popover,
      children,
    } = this.props

    return (
      <RemoteLocale currentUser={currentUser} languages={languages}>
        <App
          languages={languages}
          loading={networkStatus === NetworkStatus.loading}
          currentUser={currentUser}
          offices={offices}
          userPopover={popover && popover.type === 'user' ? popover : null}
          toggleUserPopover={R.partial(togglePopover, ['user', {}])}
        >
          {children}
        </App>
      </RemoteLocale>
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
