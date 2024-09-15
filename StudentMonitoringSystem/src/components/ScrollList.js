import React from 'react';
import { useTheme, Box, Typography } from '@mui/material';
import { tokens } from '../theme';
import { Link as RouterLink } from 'react-router-dom';
import { List, ListItem, ListItemText, Link } from '@mui/material';

const ScrollList = ({ items = [] }) => { // Default items to an empty array
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Check if items is an array
    if (!Array.isArray(items)) {
        return (
            <Box sx={{ padding: 2, textAlign: 'center', color: colors.grey[100] }}>
                <Typography>No items available</Typography>
            </Box>
        );
    }

    return (
        <List
            sx={{
                maxHeight: '100%', // Make sure the list can scroll
                overflow: 'auto',
                backgroundColor: colors.primary[400],
                borderRadius: '10px',
            }}
        >
            {items.length === 0 ? (
                <ListItem>
                    <Typography>No items found</Typography>
                </ListItem>
            ) : (
                items.map((item, index) => (
                    <ListItem key={index} sx={{ p: 1 }}>
                        <Link
                            component={RouterLink}
                            to={`/course/${item}`}
                            style={{ textDecoration: 'none', color: colors.grey[100] }}
                        >
                            <ListItemText primary={item} />
                        </Link>
                    </ListItem>
                ))
            )}
        </List>
    );
};

export default ScrollList;
