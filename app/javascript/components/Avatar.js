import React from 'react'

const styles = {
  avatar: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  figure: {
    margin: 0,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    width: 50,
    height: 50,
  },
  circle: {
    fill: '#ddd',
  },
  unknown: {
    fill: 'white',
  },
}

const Anonymous = () => (
  <svg style={styles.svg}>
    <defs>
      <clipPath id="cut-off-bottom">
        <rect x="0" y="0" width="42" height="38" />
        {/* <circle r="25" cx="25" cy="25" style={{fill: 'transparent'}} />*/}
      </clipPath>
    </defs>
    <circle r="25" cx="25" cy="25" style={styles.circle} />
    <circle r="8" cx="25" cy="18" style={styles.unknown} />
    <circle r="14" cx="25" cy="38" clipPath="url(#cut-off-bottom)" style={styles.unknown} />
  </svg>
)

const Avatar = ({ image }) => (
  <div style={styles.container}>
    <figure style={styles.figure}>
      {image ? <img alt="user" style={styles.avatar} src={image} /> : <Anonymous />}
    </figure>
  </div>
)

Avatar.defaultProps = {
  image: null,
}

export default Avatar
