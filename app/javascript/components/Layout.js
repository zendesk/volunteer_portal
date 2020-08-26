import React from 'react'
import * as R from 'ramda'

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
    boxShadow: 'inset 0 -1px #ddd',
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

const Layout = ({ children }) => (
  <div style={styles.container}>
    <div style={styles.wrapper}>{children}</div>
  </div>
)

export default Layout
