import styled from "styled-components"

export const EventsTable = styled.div`
  & > div {
    border: none;
  }

  & > div > div:nth-child(1) > div:nth-child(1) {
    box-shadow: inset 0 -2px #eee;
  }

  & {
    margin-bottom: 20px;
  }
`

export const NoEventsMessage = styled.p`
  font-style: italic;
`
