import React, { useState, useEffect } from 'react'

import '@zendeskgarden/react-tags/dist/styles.css'
import { Tag, Close } from '@zendeskgarden/react-tags'

import '@zendeskgarden/react-dropdowns/dist/styles.css'
import { Dropdown, Menu, Item, Multiselect, Field as GardenField } from '@zendeskgarden/react-dropdowns'

const TagField = ({ tags, input: { value, onChange }, maxTags }) => {
  const [selectedItems, setSelectedItems] = useState(value ? value.map(tag => tag.name) : [])
  useEffect(() => {
    // Handles existing value and transforms to mutatable format
    if (value) {
      onChange(value.map(tag => ({ id: tag.id })))
    }
  }, [])
  return (
    <Dropdown
      selectedItems={selectedItems}
      onSelect={items => {
        if (selectedItems.length < maxTags) {
          const selected = tags.filter(tag => items.includes(tag.name))
          const newValue = selected.map(selection => ({ id: selection.id }))
          console.log(newValue)
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
      <Menu>
        {tags.map(({ name, id }, index) => (
          <Item key={index} value={name}>
            <span>{name}</span>
          </Item>
        ))}
      </Menu>
    </Dropdown>
  )
}

export default TagField
