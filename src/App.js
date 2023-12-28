import React, { useState } from 'react';
import fetchGoogleImage from './fetchGoogleImage';
import llamaStreamQnA from './createShoppingList.js';
import { apiKey, cx } from './Private.js';
import { selectNDinners, formatListAsSentence, gptShoppingListPrompt, gptShoppingListPrompt2 } from './fetchMeal.js';
import './App.css';

const App = () => {
    const [searchWord, setSearchWord] = useState('');  // Now it's a single word, for the number of meals.
    const [mealNames, setMealNames] = useState([]);
    const [shoppingListPrompt, setShoppingListPrompt] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [result2, setresult2] = useState([]);

    // New State for Bot messages
    const [botMessages, setBotMessages] = useState("");

    // Function to handle the streaming of messages
    const handleLlamaStreamQnA = async (prompt) => {
        const prev = "";
        for await (const message of llamaStreamQnA(prompt)) {
            console.log(message);
            setBotMessages(prev => prev + message); // Append new message
        }
    };

    const handleSearch = async () => {
        const numDinners = parseInt(searchWord, 10);

        if (!isNaN(numDinners) && numDinners > 0) {
            try {
                const dinners = await selectNDinners(numDinners, './lists/Dinners.md');
                setMealNames(dinners);
                const shoppingListPrompt1 = gptShoppingListPrompt(formatListAsSentence(dinners));
                setShoppingListPrompt(shoppingListPrompt1);
                console.log(shoppingListPrompt1);

                const urls = await Promise.all(dinners.map(async mealName => {
                    return await fetchGoogleImage(mealName, apiKey, cx);
                }));
                setImageUrls(urls);

                // Call the streaming function with the prompt
                handleLlamaStreamQnA(shoppingListPrompt1);

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
                <textarea readOnly value={shoppingListPrompt}></textarea>
                <textarea readOnly value={botMessages}></textarea>
                <textarea readOnly value={gptShoppingListPrompt2()}></textarea>
                <textarea readOnly value={"Result2"}></textarea>
            </div>
        </div>
    );
};

export default App;
