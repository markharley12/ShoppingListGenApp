import React, { useState, useEffect, useRef } from 'react';
import fetchGoogleImage from './fetchGoogleImage';
import llamaStreamQnA from './createShoppingList.js';
import placeholderImage from './images/mealPlaceHolder.webp';
import { selectNDinners, formatListAsSentence, gptShoppingListPrompt, gptShoppingListPrompt2 } from './fetchMeal.js';
import './App.css';

const App = () => {
    const apiKey = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;
    const cx = process.env.REACT_APP_CUSTOM_SEARCH_ENGINE_ID;

    const [numMeals, setNumMeals] = useState('');
    const [mealNames, setMealNames] = useState([]);
    const [tempMealNames, setTempMealNames] = useState([]);
    const [shoppingListPrompt, setShoppingListPrompt] = useState([]);
    const [shoppingListPrompt2, setShoppingListPrompt2] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [result1, setresult1] = useState([]);
    const [result2, setresult2] = useState([]);
    const [fetchImages, setFetchImages] = useState(false); // New state for toggling image fetching

    const AutoResizingTextArea = ({ label, content }) => {
        const textareaRef = useRef(null);

        useEffect(() => {
            const adjustHeight = () => {
                const textarea = textareaRef.current;
                if (!textarea) return;
                textarea.style.height = 'inherit';
                textarea.style.height = `${textarea.scrollHeight}px`;
            };

            adjustHeight();
        }, [content]);

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
            setBotMessages(prev => prev + message);
        }
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        console.log(`useEffect Called ${result1.length} ${shoppingListPrompt2.length}`)
        const handlePrompts = async () => {
            if (result1.length > 0 && result1 !== "slot unavailable" && shoppingListPrompt2.length > 0) {
                console.log("Ready to process with updated prompts");
                console.log("Waiting 5 secs for LLM api to refresh");
                await sleep(5000);
    
                await handleLlamaStreamQnA(prompt2(), setresult2);
            }
        };
    
        handlePrompts();
    }, [result1, shoppingListPrompt2]);

    function prompt2() {
        const result1Str = Array.isArray(result1) ? result1.join(', ') : result1;
        const shoppingListPrompt2Str = Array.isArray(shoppingListPrompt2) ? shoppingListPrompt2.join(', ') : shoppingListPrompt2;
        return `My shopping list is: ${result1Str}\n\n Task:\n${shoppingListPrompt2Str}`;
    }

    async function fetchMealImages(mealNames) {
        if (!fetchImages) return new Array(mealNames.length).fill(placeholderImage);
        try {
            const urls = await Promise.all(mealNames.map(async mealName => {
                return await fetchGoogleImage(mealName, apiKey, cx);
            }));
            return urls;
        } catch (error) {
            console.error('Error fetching images:', error);
            return [];
        }
    }

    async function updateMeals() {
        try {
            setMealNames(tempMealNames);
            const prompt = gptShoppingListPrompt(formatListAsSentence(tempMealNames));
            setShoppingListPrompt(prompt);
            console.log(prompt);

            const urls = await fetchMealImages(tempMealNames);
            setImageUrls(urls);

            await handleLlamaStreamQnA(prompt, setresult1);
            console.log("finished request 1")

            await setShoppingListPrompt2(gptShoppingListPrompt2());
            console.log("finished setting gptShoppingListPrompt2")

        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    const handleSearch = async () => {
        const numDinners = parseInt(numMeals, 10);

        if (!isNaN(numDinners) && numDinners > 0) {
            try {
                const dinners = await selectNDinners(numDinners, './lists/Dinners.md');
                setMealNames(dinners);
                setTempMealNames(dinners);
                const prompt = gptShoppingListPrompt(formatListAsSentence(dinners));
                setShoppingListPrompt(prompt);
                console.log(prompt);

                const urls = await fetchMealImages(dinners);
                setImageUrls(urls);

                await handleLlamaStreamQnA(prompt, setresult1);
                console.log("finished request 1")

                await setShoppingListPrompt2(gptShoppingListPrompt2());
                console.log("finished setting gptShoppingListPrompt2")

            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const handleMealNameChange = (event, index) => {
        const updatedTempMealNames = [...tempMealNames];
        updatedTempMealNames[index] = event.target.value;
        setTempMealNames(updatedTempMealNames);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Shopping list generator App</h1>
                <div className="toggle-images-container">
                    <button onClick={() => setFetchImages(!fetchImages)}>
                        {fetchImages ? "Disable Images" : "Enable Images"}
                    </button>
                </div>
            </header>

            <div className="input-container">
                <input
                    type="text"
                    value={numMeals}
                    onChange={(e) => setNumMeals(e.target.value)}
                    placeholder="Enter number of meals"
                />
                <div className='SearchButton'>
                    <button onClick={handleSearch}>
                        Generate New Meals
                    </button>
                </div>
            </div>

            <div className="update-meals-container">
                <button onClick={updateMeals}>
                    Update Meals
                </button>
            </div>

            <div className="row-container">
                {tempMealNames.map((tempMealName, index) => (
                    <div key={index} className="meal-card">
                        <input 
                            type="text" 
                            value={tempMealName}
                            onChange={(e) => handleMealNameChange(e, index)} 
                            className="editable-meal-name"
                        />
                        <img src={imageUrls[index]} alt={tempMealName} className="meal-image" />
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
