import React from 'react';
import { TextField } from '@mui/material';

/**
 * A text field that automatically adjusts its height to fit its content.
 *
 * Useful for a field that is initially empty but can be filled with a large amount of text,
 * such as a shopping list.
 *
 * @param {string} label The label to display above the text field
 * @param {string} value The initial content of the text field
 * @param {function(string):void} onChange A callback to call when the user changes the text field's value
 * @returns {ReactElement} A text field that resizes itself to fit its content
 */

export const AutoResizingTextField = ({ label, value, onChange }) => {
    const textAreaRef = React.useRef(null);

    React.useEffect(() => {
        if (textAreaRef.current) {
            // Reset height to enable shrinking and then set it based on scrollHeight
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [value]); // Re-run the effect when the value changes

    return (
        <TextField
            label={label}
            multiline
            rows={1} // Start with 1 row
            variant="outlined"
            inputRef={textAreaRef}
            sx={{ width: '95%', marginBottom: 2 }}
            value={value}
            onChange={onChange}
            slotProps={{
                input: {
                  sx: {
                    style: { overflow: 'hidden', resize: 'none' } // Prevent manual resize
                }}
            }}
        />
    );
};

export default AutoResizingTextField;
