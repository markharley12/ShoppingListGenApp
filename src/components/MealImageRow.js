import React from 'react';
import { Box, TextField } from '@mui/material';

/**
 * MealImageRow component that displays the meal images and allows editing of meal names.
 *
 * Props:
 *   tempMealNames: an array of strings representing the meal names
 *   imageUrls: an array of strings representing the URLs of the meal images
 *   handleMealNameChange: a function that takes an event and an index, and updates the state of tempMealNames
 */
const MealImageRow = ({ tempMealNames, imageUrls, handleMealNameChange }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {tempMealNames.map((tempMealName, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', margin: 1 }}>
            <TextField
              type="text"
              value={tempMealName}
              onChange={(e) => handleMealNameChange(e, index)}
              sx={{ marginBottom: 1 }}
              variant="outlined"
              className="editable-meal-name"
              // This class name is used in the CSS to style the text field
            />
            <img
              src={imageUrls[index]}
              alt={tempMealName}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              className="meal-image"
              // This class name is used in the CSS to style the image
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MealImageRow;
