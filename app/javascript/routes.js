import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from 'pages/App'
import Calendar from 'pages/Calendar'
import EventPage from 'pages/Event'
import MyEventsPage from 'pages/MyEvents'
import Dashboard from 'pages/Dashboard'

import Admin from 'pages/admin/Admin'
import AdminDashboard from 'pages/admin/Dashboard'
import EventsAdmin from 'pages/admin/Events'
import NewEvent from 'pages/admin/Events/new'
import EditEvent from 'pages/admin/Events/edit'
import OfficesAdmin from 'pages/admin/Offices'
import NewOffice from 'pages/admin/Offices/new'
import EditOffice from 'pages/admin/Offices/edit'
import OrgsAdmin from 'pages/admin/Organizations'
import NewOrg from 'pages/admin/Organizations/new'
import EditOrg from 'pages/admin/Organizations/edit'
import EventTypesAdmin from 'pages/admin/EventTypes'
import NewEventType from 'pages/admin/EventTypes/new'
import EditEventType from 'pages/admin/EventTypes/edit'
import TagsAdmin from 'pages/admin/Tags'
import NewTags from 'pages/admin/Tags/new'
import EditTag from 'pages/admin/Tags/edit'
import UsersAdmin from 'pages/admin/Users'
import EditUser from 'pages/admin/Users/edit'
import IndividualEventsAdmin from 'pages/admin/IndividualEvents'
import Reporting from 'pages/admin/Reporting'

export default (
  <div>
    <Route path="/portal" component={App}>
      {/* Admin Namespace */}
      <Route path="/portal/admin" component={Admin}>
        <IndexRoute component={AdminDashboard} />
        <Route path="/portal/admin/events/new(/:id)" component={NewEvent} />
        <Route path="/portal/admin/events/:id/edit" component={EditEvent} />
        <Route path="/portal/admin/events" component={EventsAdmin} />
        <Route path="/portal/admin/offices/new" component={NewOffice} />
        <Route path="/portal/admin/offices/:id/edit" component={EditOffice} />
        <Route path="/portal/admin/offices" component={OfficesAdmin} />
        <Route path="/portal/admin/organizations/new" component={NewOrg} />
        <Route path="/portal/admin/organizations/:id/edit" component={EditOrg} />
        <Route path="/portal/admin/organizations" component={OrgsAdmin} />
        <Route path="/portal/admin/event-types/new" component={NewEventType} />
        <Route path="/portal/admin/event-types/:id/edit" component={EditEventType} />
        <Route path="/portal/admin/event-types" component={EventTypesAdmin} />
        <Route path="/portal/admin/tags" component={TagsAdmin} />
        <Route path="/portal/admin/tags/new" component={NewTags} />
        <Route path="/portal/admin/tags/:id/edit" component={EditTag} />
        <Route path="/portal/admin/individual_events" component={IndividualEventsAdmin} />
        <Route path="/portal/admin/users/:id/edit" component={EditUser} />
        <Route path="/portal/admin/users" component={UsersAdmin} />
        <Route path="/portal/admin/reporting" component={Reporting} />
        <Route path="*" component={AdminDashboard} />
      </Route>
      {/* Default Namespace */}
      <IndexRoute component={Calendar} />
      <Route path="/portal/dashboard" component={Dashboard} />
      {/* Keep old route */}
      <Route path="/portal/events/individual" component={MyEventsPage} />
      <Route path="/portal/events" component={MyEventsPage} />
      <Route path="/portal/events/:eventId" component={EventPage} />
      <Route path="*" component={Calendar} />
    </Route>
  </div>
)
