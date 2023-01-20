import React from 'react'
import { Menu, MenuItem } from '@mui/material'
import { v4 as uuidv4 } from 'uuid'

const CardMenu = ({ anchorEl, handleCloseDropdown, options }) => (
  <Menu
    anchorEl={anchorEl}
    keepMounted
    open={Boolean(anchorEl)}
    onClose={handleCloseDropdown}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
  >
    {options
      .filter(option => !option.isRemoved)
      .map(option => (
        <MenuItem
          key={uuidv4()}
          onClick={() => {
            option.callback()
            handleCloseDropdown()
          }}
        >
          {option.label}
        </MenuItem>
      ))}
  </Menu>
)

export default CardMenu
