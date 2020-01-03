import React from 'react'
import R from 'ramda'

const styles = {
  circularProgress: {
    width: 166,
  },
  baseRing: {
    position: 'relative',
    width: 150,
    height: 150,
    border: '8px solid #ddd',
    borderRadius: '50%',
  },
  progressRing: {
    position: 'absolute',
    width: 166, // base ring width + border on each side
    height: 166,
    top: -8,
    left: -8,
  },
  milestoneLabel: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: 'center',
    margin: 0,
    padding: '20px 0 5px',
  },
  hoursRemaining: {
    fontSize: 18,
    textAlign: 'center',
    margin: 0,
  },
  percentage: {
    position: 'absolute',
    width: 166, // base ring width + border on each side
    height: 166,
    lineHeight: '166px',
    top: -8,
    left: -8,
    textAlign: 'center',
    fontSize: 48,
    fontWeight: 200,
    color: '#777',
  },
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees + 90) * Math.PI) / 180.0

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end = polarToCartesian(x, y, radius, startAngle)

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ')

  return d
}

const ProgressCircle = ({ percent, label, sublabel, stroke }) => {
  // TODO: fix this ugly ass hack to get a full color ring
  const endAngle = R.clamp(0, 359.999, (360 * percent) / 100)

  return (
    <div style={styles.circularProgress}>
      <div style={styles.baseRing}>
        <svg style={styles.progressRing} xmlns="http://www.w3.org/2000/svg">
          <path d={describeArc(83, 83, 79, 0, endAngle)} fill="transparent" stroke={stroke} strokeWidth="8" />
        </svg>
        <span style={styles.percentage}>{percent}%</span>
      </div>
      <p style={styles.milestoneLabel}>{label}</p>
      <p style={styles.hoursRemaining}>{sublabel}</p>
    </div>
  )
}

export default ProgressCircle
