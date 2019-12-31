import React, { useState, useEffect, useRef } from 'react'

import debounce from 'lodash.debounce'
import R from 'ramda'

import '@zendeskgarden/react-tags/dist/styles.css'
import { Tag, Close } from '@zendeskgarden/react-tags'

import '@zendeskgarden/react-dropdowns/dist/styles.css'
import { Dropdown, Menu, Item, Multiselect, Field as GardenField } from '@zendeskgarden/react-dropdowns'

const TagField = ({ tags, input: { value, onChange }, maxTags }) => {
  // TODO: allow admin to set maximum number of tags
  const [selectedItems, setSelectedItems] = useState(value ? value.map(tag => tag.name) : [])
  const [inputValue, setInputValue] = React.useState('')
  const [matchingOptions, setMatchingOptions] = React.useState(tags.map(tag => tag.name))

  /**
   * Debounce filtering
   */
  const filterMatchingOptionsRef = React.useRef(
    debounce(value => {
      const matchingOptions = tags
        .map(tag => tag.name)
        .filter(option => {
          return (
            option
              .trim()
              .toLowerCase()
              .indexOf(value.trim().toLowerCase()) !== -1
          )
        })

      setMatchingOptions(matchingOptions)
    }, 300)
  )

  useEffect(() => {
    // Handles existing value and transforms to mutatable format
    if (value) {
      onChange(value.map(tag => ({ id: tag.id })))
    }
  }, [])

  React.useEffect(() => {
    filterMatchingOptionsRef.current(inputValue)
  }, [inputValue])

  const renderOptions = () => {
    if (matchingOptions.length === 0) {
      return <Item disabled>No matches found</Item>
    }

    return matchingOptions.map((name, index) => (
      <Item key={index} value={name}>
        <span>{name}</span>
      </Item>
    ))
  }

  return (
    <Dropdown
      inputValue={inputValue}
      selectedItems={selectedItems}
      onInputValueChange={inputValue => {
        setInputValue(inputValue)
      }}
      downshiftProps={{ defaultHighlightedIndex: 0 }}
      onSelect={items => {
        if (!maxTags || selectedItems.length < maxTags) {
          const selected = tags.filter(tag => items.includes(tag.name))
          const newValue = selected.map(selection => ({ id: selection.id }))
          onChange(newValue)
          setSelectedItems(items)
        } else if (items.length <= selectedItems.length) {
          onChange(items)
          setSelectedItems(items)
        }
      }}
    >
      <GardenField>
        <Multiselect
          renderItem={({ value, removeValue }) => (
            <Tag size="large">
              {value} <Close onClick={() => removeValue()} />
            </Tag>
          )}
        />
      </GardenField>
      <Menu>{renderOptions()}</Menu>
    </Dropdown>
  )
}

export default TagField
