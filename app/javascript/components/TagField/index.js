import React from 'react'

import debounce from 'lodash.debounce'
import * as R from 'ramda'

import { Tag, Close } from '@zendeskgarden/react-tags'
import { Dropdown, Menu, Item, Multiselect, Field as GardenField } from '@zendeskgarden/react-dropdowns'

const TagField = ({ tags, input: { value, onChange } }) => {
  // TODO: allow admin to set maximum number of tags
  const [inputValue, setInputValue] = React.useState('')
  const [matchingOptions, setMatchingOptions] = React.useState(tags)

  /**
   * Debounce filtering
   */
  const filterMatchingOptionsRef = React.useRef(
    debounce(textInput => {
      const matchingOptions = tags.filter(tag => {
        return (
          tag.name
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
    return matchingOptions.map(({ name, id }, index) => (
      <Item key={index} value={id}>
        <span>{name}</span>
      </Item>
    ))
  }

  const findTagName = value =>
    R.pipe(
      R.find(R.propEq('id', value)),
      R.propOr('', 'name')
    )(tags)

  return (
    <Dropdown
      inputValue={inputValue}
      selectedItems={R.map(R.prop('id'), value)}
      onInputValueChange={setInputValue}
      downshiftProps={{ defaultHighlightedIndex: 0 }}
      onSelect={items => {
        const selected = tags.filter(tag => items.includes(tag.id))
        onChange(R.map(R.pick(['id']), selected))
      }}
    >
      <GardenField>
        <Multiselect
          renderItem={({ value, removeValue }) => (
            <Tag size="large">
              {findTagName(value)} <Close onClick={() => removeValue()} />
            </Tag>
          )}
        />
      </GardenField>
      <Menu>{renderOptions()}</Menu>
    </Dropdown>
  )
}

export default TagField
