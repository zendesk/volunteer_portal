import React from 'react'
import { Dropdown, Menu, Item, Autocomplete, Field as GardenField } from '@zendeskgarden/react-dropdowns'
import debounce from 'lodash.debounce'
import * as R from 'ramda'

import { ThemeProvider } from '@zendeskgarden/react-theming'
import '@zendeskgarden/react-dropdowns/dist/styles.css'

const ReduxFormAutocomplete = ({ dataSource, input: { value, onChange }, searchField, maxHeight }) => {
  const [inputValue, setInputValue] = React.useState('')
  const [matchingOptions, setMatchingOptions] = React.useState(dataSource)

  /**
   * Debounce filtering
   */
  const filterMatchingOptionsRef = React.useRef(
    debounce(textInput => {
      const matchingOptions = dataSource.filter(data => {
        return (
          data[searchField]
            .trim()
            .toLowerCase()
            .indexOf(textInput.trim().toLowerCase()) !== -1
        )
      })

      setMatchingOptions(matchingOptions)
    }, 300)
  )

  React.useEffect(() => {
    filterMatchingOptionsRef.current(inputValue)
  }, [inputValue])

  const renderOptions = () => {
    if (matchingOptions.length === 0) {
      return <Item disabled>No matches found</Item>
    }

    return matchingOptions.map(({ id, name }, index) => (
      <Item key={index} value={id}>
        <span>{name}</span>
      </Item>
    ))
  }

  const findDataSourceName = value =>
    R.pipe(
      R.find(R.propEq('id', value)),
      R.propOr('', 'name')
    )(dataSource)

  return (
    <ThemeProvider>
      <Dropdown
        inputValue={inputValue}
        selectedItem={value}
        onSelect={onChange}
        onInputValueChange={setInputValue}
        downshiftProps={{ defaultHighlightedIndex: 0, itemToString: findDataSourceName }}
      >
        <GardenField>
          <Autocomplete>
            <span>{findDataSourceName(value)}</span>
          </Autocomplete>
        </GardenField>
        <Menu maxHeight={maxHeight}>{renderOptions()}</Menu>
      </Dropdown>
    </ThemeProvider>
  )
}

export default ReduxFormAutocomplete
