import React, { useState } from 'react'

import '@zendeskgarden/react-tags/dist/styles.css'
import { Tag, Close } from '@zendeskgarden/react-tags'

import '@zendeskgarden/react-dropdowns/dist/styles.css'
import { Dropdown, Menu, Item, Trigger, Multiselect, Field as GardenField } from '@zendeskgarden/react-dropdowns'

const TagField = ({ tags, input: { value, onChange }, maxTags }) => {
  const [selectedItems, setSelectedItems] = useState([])
  return (
    <Dropdown
      selectedItems={selectedItems}
      onSelect={items => {
        if (selectedItems.length < maxTags) {
          console.log(items, selectedItems)
          const selectedIds = tags.filter(tag => items.includes(tag.name)).map(tag => tag.id)
          onChange(selectedIds)
          setSelectedItems(items)
        } else if (items.length < selectedItems.length) {
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
