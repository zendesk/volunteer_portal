import React from 'react'
import { Link } from 'react-router'
import R from 'ramda'

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  wrapper: {
    padding: '0 20px 20px',
    width: 935,
    height: 750,
  },
  navBar: {
    width: '100%',
    display: 'flex',
    flexFlow: 'row nowrap',
    borderBottom: '1px solid #ddd',
    marginBottom: 50,
  },
  btn: {
    fontWeight: 'normal',
    border: 'none',
    borderImage: 'none',
    background: 'none',
    borderBottom: '3px solid transparent',
    padding: '8px 10px',
    color: '#333',
    display: 'inline-block',
  },
  btnSpacer: {
    width: 15,
  },
}

styles.activeBtn = R.merge(styles.btn, {
  fontWeight: 500,
  borderBottom: '3px solid #30aabc',
})

const Tab = ({ path, text, currentPath }) => {
  let label
  let style

  if (path === currentPath) {
    label = `${text} - Active`
    style = styles.activeBtn
  } else {
    label = text
    style = styles.btn
  }

  return (
    <Link to={path}>
      <span style={style} aria-labelledby={label}>
        {text}
      </span>
    </Link>
  )
}

const Layout = ({ noNav, currentPath, children }) => (
  <div style={styles.container}>
    <div style={styles.wrapper}>
      {noNav ? null : (
        <div style={styles.navBar}>
          <Tab path="/portal" text="Calendar" currentPath={currentPath} />
          <div style={styles.btnSpacer} />
          <Tab path="/portal/dashboard" text="Dashboard" currentPath={currentPath} />
          <div style={styles.btnSpacer} />
          <Tab path="/portal/events/individual" text="Individual Events" currentPath={currentPath} />
        </div>
      )}
      {children}
    </div>
  </div>
)

export default Layout
