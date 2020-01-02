import React from 'react'
import { Dropdown, Menu, Item, Autocomplete, Field as GardenField } from '@zendeskgarden/react-dropdowns'
import debounce from 'lodash.debounce'
import R from 'ramda'

const ReduxFormAutocomplete = ({ dataSource, input: { onChange }, searchField }) => {
  const searchData = dataSource.map(data => data[searchField])
  // Selected Item is the String
  const [selectedItem, setSelectedItem] = React.useState('')
  const [inputValue, setInputValue] = React.useState('')
  const [matchingOptions, setMatchingOptions] = React.useState(searchData)

  /**
   * Debounce filtering
   */
  const filterMatchingOptionsRef = React.useRef(
    debounce(value => {
      const matchingOptions = searchData.filter(data => {
        return (
          data
            .trim()
            .toLowerCase()
            .indexOf(value.trim().toLowerCase()) !== -1
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

    return matchingOptions.map(option => (
      <Item key={option} value={option}>
        <span>{option}</span>
      </Item>
    ))
  }

  return (
    <Dropdown
      inputValue={inputValue}
      selectedItem={selectedItem}
      onSelect={item => {
        const itemData = dataSource.find(data => data[searchField] === item)
        setSelectedItem(item)
        onChange(R.prop('id', itemData))
      }}
      onInputValueChange={inputValue => {
        setInputValue(inputValue)
      }}
      downshiftProps={{ defaultHighlightedIndex: 0 }}
    >
      <GardenField>
        <Autocomplete>
          <span>{selectedItem}</span>
        </Autocomplete>
      </GardenField>
      <Menu>{renderOptions()}</Menu>
    </Dropdown>
  )
}

export default ReduxFormAutocomplete
