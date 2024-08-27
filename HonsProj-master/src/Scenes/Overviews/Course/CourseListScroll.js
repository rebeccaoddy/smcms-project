import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const CourseListScroll = ({ items = [], onItemClick }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState(items);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredItems(items); // Show all items if searchQuery is empty
        } else {
            setFilteredItems(
                items.filter(item => 
                    item.course_name && item.course_name.toLowerCase().includes(searchQuery.toLowerCase())
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
            height: '100%', 
            width: '100%', 
            padding: '10px',
            backgroundColor: colors.background, 
            scrollbarWidth: 'thin', 
            msOverflowStyle: 'none' 
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
            {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                    <button 
                        key={item._id} // Use _id as the key
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px',
                            margin: '5px 0',
                            backgroundColor: colors.buttonBackground,
                            color: colors.buttonText,
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            textAlign: 'left'
                        }}
                        onClick={() => onItemClick(item)} // Pass the entire item
                    >
                        {item.course_name} {/* Render the course_name */}
                    </button>
                ))
            ) : (
                <Typography>No courses available</Typography>
            )}
        </div>
    );
};
export default CourseListScroll;
