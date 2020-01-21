import styled from 'styled-components'

import * as R from 'ramda'

const spacingXxs = R.path(['theme', 'styles', 'spacing', 'xxs'])

export default styled.div`
  display: inline-flex;
  margin-bottom: ${spacingXxs};
  > * {
    margin-left: ${spacingXxs};
  }
  > :first-child {
    margin-left: 0;
  }
`
