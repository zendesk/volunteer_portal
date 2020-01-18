import React from 'react'
import { withRouter } from 'react-router'

import Layout from 'components/Layout'
import Leaderboard from './Leaderboard'
import Milestones from './Milestones'

const Dashboard = ({ location }) => (
  <div>
    <Layout currentPath={location.pathname}>
      <Milestones />
      <Leaderboard />
    </Layout>
  </div>
)

export default withRouter(Dashboard)
