import React, { useState } from 'react';
import fetchGoogleImage from './fetchGoogleImage';
import { apiKey, cx } from './Private.js';
import { selectNDinners, formatListAsSentence, gptShoppingListPrompt, gptShoppingListPrompt2 } from './fetchMeal.js';
import './App.css';

const App = () => {
    const [searchWord, setSearchWord] = useState('');  // Now it's a single word, for the number of meals.
    const [mealNames, setMealNames] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);

    const handleSearch = async () => {
        const numDinners = parseInt(searchWord, 10);

        if (!isNaN(numDinners) && numDinners > 0) {
            try {
                const dinners = await selectNDinners(numDinners, './lists/Dinners.md');
                setMealNames(dinners);
                console.log(dinners);

                const urls = await Promise.all(dinners.map(async mealName => {
                    return await fetchGoogleImage(mealName, apiKey, cx);
                }));

                setImageUrls(urls);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Shopping list generator App</h1>
            </header>

            <div className="input-container">
                <input
                    type="text"
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                    placeholder="Enter number of meals"
                />
                <div className='SearchButton'>
                    <button onClick={handleSearch}>
                        Generate Meals
                    </button>
                </div>
            </div>

            <div className="row-container">
                {mealNames.map((mealName, index) => (
                    <div key={index} className="meal-card">
                        <h3>{mealName}</h3>
                        <img src={imageUrls[index]} alt={mealName} />
                    </div>
                ))}
            </div>
            
            {/* New addition */}
            <div className="prompt-container">
                <textarea readOnly value={gptShoppingListPrompt(formatListAsSentence(mealNames))}></textarea>
                <textarea readOnly value={gptShoppingListPrompt2()}></textarea>
            </div>
        </div>
    );
};

export default App;
