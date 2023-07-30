import React, { useState } from 'react';
import GoogleImageComponent from './GoogleImageComponent';
import { apiKey, cx } from './Private.js';
import './App.css';

const App = () => {
  const [searchWord1, setSearchWord1] = useState('');
  const [searchWord2, setSearchWord2] = useState('');
  const [searchWord3, setSearchWord3] = useState('');
  const [imageUrl1, setImageUrl1] = useState(null);
  const [imageUrl2, setImageUrl2] = useState(null);
  const [imageUrl3, setImageUrl3] = useState(null);

  const handleSearch = () => {
    if (searchWord1.trim() !== '') {
      GoogleImageComponent(searchWord1, apiKey, cx)
        .then((url) => {
          setImageUrl1(url);
        })
        .catch((error) => {
          console.error('Error fetching Google image:', error);
        });
    }

    if (searchWord2.trim() !== '') {
      GoogleImageComponent(searchWord2, apiKey, cx)
        .then((url) => {
          setImageUrl2(url);
        })
        .catch((error) => {
          console.error('Error fetching Google image:', error);
        });
    }

    if (searchWord3.trim() !== '') {
      GoogleImageComponent(searchWord3, apiKey, cx)
        .then((url) => {
          setImageUrl3(url);
        })
        .catch((error) => {
          console.error('Error fetching Google image:', error);
        });
    }
  };

  return (
    <div className="App">
      <div className="row-container">
        <div className="input-container">
          <input
            type="text"
            value={searchWord1}
            onChange={(e) => setSearchWord1(e.target.value)}
            placeholder="Enter search word 1"
          />
          <button onClick={handleSearch}>Search 1</button>
          <input
            type="text"
            value={searchWord2}
            onChange={(e) => setSearchWord2(e.target.value)}
            placeholder="Enter search word 2"
          />
          <button onClick={handleSearch}>Search 2</button>
          <input
            type="text"
            value={searchWord3}
            onChange={(e) => setSearchWord3(e.target.value)}
            placeholder="Enter search word 3"
          />
          <button onClick={handleSearch}>Search 3</button>
        </div>
      </div>

      <div className="row-container">
        <div className="input-container">
        </div>
        {imageUrl1 && <img src={imageUrl1} alt={searchWord1} />}
        {imageUrl2 && <img src={imageUrl2} alt={searchWord2} />}
        {imageUrl3 && <img src={imageUrl3} alt={searchWord3} />}
      </div>
    </div>
  );
};

export default App;

