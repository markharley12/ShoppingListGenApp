import React, { useEffect, useRef } from 'react';

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