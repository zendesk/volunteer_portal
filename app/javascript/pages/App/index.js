import React, { Component } from 'react'
import * as R from 'ramda'
import { compose, graphql } from 'react-apollo'
import { NetworkStatus } from 'apollo-client'
import { connect } from 'react-redux'

import App from 'components/App'

import { togglePopover } from 'actions'

import AppQuery from './query.gql'
import UpdateUserOfficeMutation from './UpdateUserOfficeMutation.gql'

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
      updateUserOffice,
    } = this.props

    return (
      <App
        loading={networkStatus === NetworkStatus.loading}
        currentUser={currentUser}
        offices={offices}
        userPopover={popover && popover.type === 'user' ? popover : null}
        toggleUserPopover={R.partial(togglePopover, ['user', {}])}
        updateUserOffice={updateUserOffice}
      >
        {children}
      </App>
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
  }),
  graphql(UpdateUserOfficeMutation, {
    props: ({ ownProps, mutate }) => ({
      updateUserOffice: (user, office) =>
        mutate({
          variables: { userId: user.id, officeId: office.id },
          optimisticResponse: {
            __typename: 'Mutation',
            updateUserOffice: R.merge(user, {
              __typename: 'User',
              office: R.merge(office, {
                __typename: 'Office',
              }),
            }),
            currentUser: R.merge(user, { office }),
          },
          refetchQueries: [
            {
              query: AppQuery,
            },
          ],
        }).then(() => ownProps.togglePopover('user')),
    }),
  })
)

const withActions = connect(
  mapStateToProps,
  {
    togglePopover,
  }
)

export default withActions(withData(AppPage))
