# UI State

## Popovers

### Model

An example popover state:

```js
{
  popover: { type: 'event', data: { id: 20, title: "Hackaton", ... }, anchorEl: null },
}
```

Only one popover should ever be shown in the app at a time. It is one of the following:

```gql
union Popover
    = Event # used on Calendar page for quick signup and link to event details page
    | User # used in navigation bar to show menu with options for switching an office
    # Admin pages
    | EditEvent
    | DestroyEvent
    | EditOrg
    | DestroyOrg
    | DestroyUser
    | EditIndividualEvent
    | DestroyIndividualEvent
```

The `data` field is used to store any information needed to render the popover.
The `anchorEl` field is sometimes used when a popover needs to be dynamically attached to a DOM element.

## Update

Use the `togglePopover` function. It takes up to 3 arguments:

* `popoverType : string`
* `data : object`
* `anchorEl : HTMLElement`

## View

Simply storing only one popover state will not guarantee that multiple popovers are not rendered at the same time.

Example of a common mistake:

```js
const somePage = props => {
  const { popover } = props
  return (
    <div>
      {popover ? <EventPopover event={popover.data} /> : null}
      {popover ? <UserPopover user={popover.data} /> : null}
    </div>
  )
}
```

If `popover` is of type `user`, both of these popovers would show at the same time!

So, in `mapStateToProps` we need to determine if the `popover` that's set in the UI (Redux) state is the correct type of popover to render.

```js
const mapStateToProps = ({ popover }) => ({
  eventPopover: popover && popover.type === 'event' ? popover : null,
  userPopover: popover && popover.type === 'user' ? popover : null,
})
```

Now we can write:

```js
const somePage = props => {
  const { eventPopover, userPopover } = props
  return (
    <div>
      {eventPopover ? <EventPopover event={eventPopover.data} /> : null}
      {userPopover ? <UserPopover user={userPopover.data} /> : null}
    </div>
  )
}
```
