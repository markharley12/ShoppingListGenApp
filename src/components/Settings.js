// components/Settings.js
import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Settings = ({ fetchImages, setFetchImages }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <IconButton
        sx={{ marginLeft: 1 }}
        onClick={toggleVisibility}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={isVisible} onClose={toggleVisibility}>
        <div style={{ width: '250px', padding: '1rem' }}>
          <h2>Settings</h2>
          <label>
            <input
              type="checkbox"
              checked={fetchImages}
              onChange={(e) => setFetchImages(e.target.checked)}
            />
            Fetch Meal Images
          </label>
          {/* Add more settings here as needed */}
        </div>
      </Drawer>
    </>
  );
};

export default Settings;
