import React from 'react';
import { Box } from '@mui/material';
import AutoResizingTextField from './AutoResizingTextField';

/**
 * ShoppingList component that displays the conversation between the user and the bot.
 */
const ShoppingList = ({
  shoppingListPrompt,
  setShoppingListPrompt,
  result1,
  shoppingListPrompt2,
  setShoppingListPrompt2,
  result2,
}) => {
  return (
    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <AutoResizingTextField
        label="[User]"
        value={shoppingListPrompt}
        onChange={(e) => setShoppingListPrompt(e.target.value)}
      />
      <AutoResizingTextField label="[Bot]" value={result1} readOnly />
      <AutoResizingTextField
        label="[User]"
        value={shoppingListPrompt2}
        onChange={(e) => setShoppingListPrompt2(e.target.value)}
      />
      <AutoResizingTextField label="[Bot]" value={result2} readOnly />
    </Box>
  );
};

export default ShoppingList;
