import React, { useEffect, useRef } from 'react';
import { TextField } from '@mui/material';

export const AutoResizingTextArea = ({ label, content }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        const adjustHeight = () => {
            const textarea = textareaRef.current;
            if (!textarea) return;
            textarea.style.height = 'inherit';
            textarea.style.height = `${textarea.scrollHeight}px`;
        };

        adjustHeight();
    }, [content]);

    return (
        <textarea
            readOnly
            ref={textareaRef}
            value={`${label} ${content}`}
        />
    );
};

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
    const textAreaRef = useRef(null);

    useEffect(() => {
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
            maxRows={6} // Limit to 6 rows to avoid excessive height
            InputProps={{
                style: { overflow: 'hidden', resize: 'none' } // Prevent manual resize
            }}
        />
    );
};