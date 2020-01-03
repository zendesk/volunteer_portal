import React from 'react'
import * as R from 'ramda'

import s from './main.css'

const Blackout = ({ width }) => <span className={s.blackout}>{'W'.repeat(width)}</span>

export default Blackout
