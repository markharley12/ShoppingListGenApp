import React, { useState } from 'react';
import fetchGoogleImage from './fetchGoogleImage';
import { apiKey, cx } from './Private.js';
import './App.css';

const App = () => {
  const [searchWords, setSearchWords] = useState(['', '', '']);
  const [imageUrls, setImageUrls] = useState([null, null, null]);

  const handleSearch = (index) => {
    const searchWord = searchWords[index].trim();

    if (searchWord) {
      fetchGoogleImage(searchWord, apiKey, cx)
        .then((url) => {
          const newImageUrls = [...imageUrls];
          newImageUrls[index] = url;
          setImageUrls(newImageUrls);
        })
        .catch((error) => {
          console.error('Error fetching Google image:', error);
        });
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="App-header">
        <h1>Shopping list generator App</h1>
      </header>

      <div className="row-container">
        {searchWords.map((word, index) => (
          <div key={index} className="input-container">
            <input
              type="text"
              value={word}
              onChange={(e) => {
                const newSearchWords = [...searchWords];
                newSearchWords[index] = e.target.value;
                setSearchWords(newSearchWords);
              }}
              placeholder={`Enter search word ${index + 1}`}
            />
            <div className='SearchButton'>
              <button onClick={() => handleSearch(index)}>
                Search {index + 1}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="row-container">
        {imageUrls.map((url, index) => (
          url ? <img key={index} src={url} alt={searchWords[index]} /> : null
        ))}
      </div>
    </div>
  );
};

export default App;
