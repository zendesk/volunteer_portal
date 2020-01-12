import React, { useContext } from 'react'

import * as R from 'ramda'
import { Grid, Row, Col } from '@zendeskgarden/react-grid'
import { ThemeProvider } from '@zendeskgarden/react-theming'
import { UserContext } from '../../context'

import ConfirmProfileAlert from './ConfirmProfileAlert'

import '@zendeskgarden/react-grid/dist/styles.css'
import '@zendeskgarden/react-notifications/dist/styles.css'

const isFirstSignIn = R.propSatisfies(R.isNil, 'lastSignInAt')
const confirmedProfileSetting = R.complement(R.path(['preference', 'confirmedProfileSettings']))
const requireConfirmProfileSettings = R.allPass([isFirstSignIn, confirmedProfileSetting])

const Notifications = () => {
  const currentUser = useContext(UserContext)

  if (requireConfirmProfileSettings(currentUser)) {
    return (
      <ThemeProvider>
        <Grid>
          <Row justifyContent="center" style={{ marginBottom: 16 }}>
            <Col md="auto">
              <ConfirmProfileAlert user={currentUser} />
            </Col>
          </Row>
        </Grid>
      </ThemeProvider>
    )
  }

  return null
}

export default Notifications
