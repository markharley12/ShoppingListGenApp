import React, { useState, useEffect, useRef } from 'react';
import fetchGoogleImage from './fetchGoogleImage';
import llamaStreamQnA from './createShoppingList.js';
import { apiKey, cx } from './Private.js';
import { selectNDinners, formatListAsSentence, gptShoppingListPrompt, gptShoppingListPrompt2 } from './fetchMeal.js';
import './App.css';

const App = () => {
    const [searchWord, setSearchWord] = useState('');  // Now it's a single word, for the number of meals.
    const [mealNames, setMealNames] = useState([]);
    const [shoppingListPrompt, setShoppingListPrompt] = useState([]);
    const [shoppingListPrompt2, setShoppingListPrompt2] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [result1, setresult1] = useState([]);
    const [result2, setresult2] = useState([]);

    const AutoResizingTextArea = ({ label, content }) => {
        const textareaRef = useRef(null);

        useEffect(() => {
            // This function adjusts the height of textarea to fit its content
            const adjustHeight = () => {
            const textarea = textareaRef.current;
            if (!textarea) return;
            textarea.style.height = 'inherit'; // Reset height to recalibrate
            textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
            };

            adjustHeight();
        }, [content]); // Run the effect on content change

        return (
            <textarea
            readOnly
            ref={textareaRef}
            value={`${label} ${content}`}
            />
        );
    };

    const handleLlamaStreamQnA = async (prompt, setBotMessages) => {
        console.log(`prompt:\n${prompt}`)
        setBotMessages("")
        for await (const message of llamaStreamQnA(prompt)) {
            console.log(message);
            setBotMessages(prev => prev + message); // Append new message
        }
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        console.log(`useEffect Called ${result1.length} ${shoppingListPrompt2.length}`)
        const handlePrompts = async () => {
            if (result1.length > 0 && result1 != "slot unavailable" && shoppingListPrompt2.length > 0) { // Check for non-empty
                console.log("Ready to process with updated prompts");
                console.log("Waiting 5 secs for LLM api to refresh");
                await sleep(5000); // Wait for 5 seconds
    
                await handleLlamaStreamQnA(prompt2(), setresult2);
            }
        };
    
        handlePrompts();
    }, [result1, shoppingListPrompt2]); // Depend on result1 and shoppingListPrompt2

    function prompt2() {
        const result1Str = Array.isArray(result1) ? result1.join(', ') : result1;
        const shoppingListPrompt2Str = Array.isArray(shoppingListPrompt2) ? shoppingListPrompt2.join(', ') : shoppingListPrompt2;
        return `My shopping list is: ${result1Str}\n\n Task:\n${shoppingListPrompt2Str}`;
    }  

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

                await handleLlamaStreamQnA(shoppingListPrompt1, setresult1);
                console.log("finised request 1")

                await setShoppingListPrompt2(gptShoppingListPrompt2());
                console.log("finised setting gptShoppingListPrompt2")

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

            <div className="prompt-container">
                <AutoResizingTextArea label="[User]" content={shoppingListPrompt} />
                <AutoResizingTextArea label="[Bot]" content={result1} />
                <AutoResizingTextArea label="[User]" content={shoppingListPrompt2} />
                <AutoResizingTextArea label="[Bot]" content={result2} />
            </div>
        </div>
    );
};

export default App;
