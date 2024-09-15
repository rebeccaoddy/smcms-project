import React from 'react';
import { ButtonGroup, Button } from "@mui/material";

const GraphToggleButton = ({ options = [], selectedOption, setSelectedOption }) => {
    return (
        <ButtonGroup variant="contained" color="primary">
            {options.map((option) => (
                <Button
                    key={option}
                    onClick={() => setSelectedOption(option)}
                    variant={selectedOption === option ? 'contained' : 'outlined'}
                >
                    {option}
                </Button>
            ))}
        </ButtonGroup>
    );
};

export default GraphToggleButton;
