import React from 'react'

const styles = {
  container: {
    borderRadius: 4,
    backgroundColor: '#eee',
    overflow: 'hidden',
    height: 30,
    minWidth: 350,
  },
  remaining: {
    textAlign: 'center',
    margin: '0 auto',
  },
  completedText: {
    lineHeight: '30px',
  },
  remainingText: {
    lineHeight: '30px',
  },
}

const completedStyles = props => {
  const p = props.value / (props.max - props.min)
  const width = Math.ceil(p * 100)

  return {
    height: '100%',
    width: `${width}%`,
    backgroundColor: '#30aabc',
    textAlign: 'center',
    display: p === 0 ? 'none' : 'inline-block',
    float: 'left',
    color: width < 10 ? 'transparent' : 'white',
  }
}

const remainingStyles = props => {
  const p = 1 - props.value / (props.max - props.min)
  const width = Math.floor(p * 100)

  return {
    height: '100%',
    textAlign: 'center',
    width: `${width}%`,
    display: p === 0 ? 'none' : 'inline-block',
    float: 'right',
    color: width < 10 ? 'transparent' : null,
  }
}

const getCompletedText = props => {
  const completed = props.value - props.min
  if (completed === 0) {
    return ''
  }
  return `${completed} ${props.completedText}`
}

const getRemainingText = props => {
  const remaining = props.max - props.value
  if (remaining === 0) {
    return ''
  }
  return `${remaining} ${props.remainingText}`
}

const LabeledProgress = props => (
  <div style={styles.container}>
    <div style={completedStyles(props)}>
      <span style={styles.completedText}>{getCompletedText(props)}</span>
    </div>
    <div style={remainingStyles(props)}>
      <span style={styles.remainingText}>{getRemainingText(props)}</span>
    </div>
  </div>
)

LabeledProgress.defaultProps = {
  min: 0,
  max: 100,
  value: 0,
  completedText: 'completed',
  remainingText: 'remaining',
}

export default LabeledProgress
