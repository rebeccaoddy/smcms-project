import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const ListScrollTest = ({ items, onItemClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);  

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  // Update filteredItems whenever searchQuery or items change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items); // If searchQuery is empty, show all items
    } else {
      setFilteredItems(
        items.filter(item => 
          item && item.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, items]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div style={{ 
      overflowY: 'scroll', 
      height: '100%',  // Ensure the ListScrollTest takes the full height available
      width: '100%',   // Ensure the ListScrollTest takes the full width available
      padding: '10px',
      backgroundColor: colors.background , // Set background color based on theme
      scrollbarWidth: 'thin',  // For Firefox
        // For Firefox
      msOverflowStyle: 'none'  // For Internet Explorer and Edge
    }}>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{
          width: '100%',
          padding: '10px',
          margin: '5px 0',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
      {filteredItems.map((item, index) => (
        <button 
          key={index} 
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            margin: '5px 0',
            backgroundColor: colors.buttonBackground,  // Set button background color based on theme
            color: colors.buttonText,  // Set button text color based on theme
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onClick={() => onItemClick(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default ListScrollTest