// components/Settings.js
import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { IconButton, FormControlLabel, Switch } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeToggle from './ThemeToggle';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFetchImages } from '../reducers/settingsSlice';

const Settings = () => {
  const [isVisible, setIsVisible] = useState(false);
  const fetchImages = useSelector((state) => state.settings.fetchImages);
  const dispatch = useDispatch();

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
            <ThemeToggle />
            <FormControlLabel
                control={
                    <Switch 
                        checked={fetchImages} 
                        onChange={() => dispatch(toggleFetchImages())}
                    />
                }
                label="Enable Images"
            />
          {/* Add more settings here as needed */}
      </div>
      </Drawer>
    </>
  );
};

export default Settings;
