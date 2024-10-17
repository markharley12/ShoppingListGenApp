// components/Settings.js
import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { IconButton, FormControlLabel, Switch, TextField, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeToggle from './ThemeToggle';
import { useSelector, useDispatch } from 'react-redux';
import { 
  toggleFetchImages, 
  setGoogleCloudApiKey, 
  setCustomSearchEngineId, 
  setLlmApiUrl, 
  setLlmApiKey 
} from '../reducers/settingsSlice';

const Settings = () => {
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  const fetchImages = useSelector((state) => state.settings.fetchImages);
  const googleCloudApiKey = useSelector((state) => state.settings.googleCloudApiKey);
  const customSearchEngineId = useSelector((state) => state.settings.customSearchEngineId);
  const llmApiUrl = useSelector((state) => state.settings.llmApiUrl);
  const llmApiKey = useSelector((state) => state.settings.llmApiKey);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleSave = () => {
    console.log('Settings saved:', { googleCloudApiKey, customSearchEngineId, llmApiUrl, llmApiKey });
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
            <h3>API and Keys</h3>
            <TextField
              label="LLM API URL"
              value={llmApiUrl}
              onChange={(e) => dispatch(setLlmApiUrl(e.target.value))}
              fullWidth
              margin="normal"
            />
            <TextField
              label="LLM API Key"
              value={llmApiKey}
              onChange={(e) => dispatch(setLlmApiKey(e.target.value))}
              fullWidth
              margin="normal"
            />
            <h4>Image retreival</h4>
            <TextField
              label="Google Cloud API Key"
              value={googleCloudApiKey}
              onChange={(e) => dispatch(setGoogleCloudApiKey(e.target.value))}
              fullWidth
              margin="normal"
              disabled={!fetchImages}
            />
            <TextField
              label="Custom Search Engine ID"
              value={customSearchEngineId}
              onChange={(e) => dispatch(setCustomSearchEngineId(e.target.value))}
              fullWidth
              margin="normal"
              disabled={!fetchImages}
            />
            <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '1rem' }}>
              Save API and Keys
            </Button>
        </div>
      </Drawer>
    </>
  );
};

export default Settings;
