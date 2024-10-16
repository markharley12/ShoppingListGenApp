import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchBotMessages, sleep, fetchMealImages } from './helperFunctions.js';
import { AutoResizingTextField } from './components.js';
import { selectNDinners, formatListAsSentence, gptShoppingListPrompt, gptShoppingListPrompt2 } from './fetchMeal.js';
import { CssBaseline, Box, Button, TextField, Typography, FormControlLabel, Switch } from '@mui/material';
import { lightTheme, darkTheme } from './theme'; // Adjust path as needed
import { useTheme } from './themeContext.js';


const App = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const [numMeals, setNumMeals] = useState('');
    const [mealNames, setMealNames] = useState([]);
    const [tempMealNames, setTempMealNames] = useState([]);
    const [shoppingListPrompt, setShoppingListPrompt] = useState([]);
    const [shoppingListPrompt2, setShoppingListPrompt2] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [result1, setResult1] = useState([]);
    const [result2, setResult2] = useState([]);
    const [fetchImages, setFetchImages] = useState(false); // New state for toggling image fetching

    const prompt2 = useCallback(() => {
        const result1Str = Array.isArray(result1) ? result1.join(', ') : result1;
        const shoppingListPrompt2Str = Array.isArray(shoppingListPrompt2) ? shoppingListPrompt2.join(', ') : shoppingListPrompt2;
        return `My shopping list is: ${result1Str}\n\n Task:\n${shoppingListPrompt2Str}`;
    }, [result1, shoppingListPrompt2]);

    const handlePrompts = useCallback(async () => {
        if (result1.length > 0 && result1 !== "slot unavailable" && shoppingListPrompt2.length > 0) {
            console.log("Ready to process with updated prompts");
            console.log("Waiting 5 secs for LLM api to refresh");
            await sleep(5000);
    
            await fetchBotMessages(prompt2(), setResult2);
        }
    }, [result1, shoppingListPrompt2, prompt2]);
    
    useEffect(() => {
        console.log(`useEffect Called ${result1.length} ${shoppingListPrompt2.length}`);
        handlePrompts();
    }, [result1, shoppingListPrompt2, handlePrompts]);

    async function updateMeals() {
        try {
            setMealNames(tempMealNames);
            const prompt = gptShoppingListPrompt(formatListAsSentence(tempMealNames));
            setShoppingListPrompt(prompt);
            console.log(prompt);

            const urls = await fetchMealImages(tempMealNames, fetchImages);
            setImageUrls(urls);

            await fetchBotMessages(prompt, setResult1);
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

                const urls = await fetchMealImages(dinners, fetchImages);
                setImageUrls(urls);

                await fetchBotMessages(prompt, setResult1);
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
        <>
            <CssBaseline />
            <Box sx={{ textAlign: 'center', bgcolor: 'background.default', minHeight: '10vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', width: '100%', boxSizing: 'border-box' }}>
                <Typography variant="h8" sx={{ fontSize: 'calc(15px + 2vmin)' }}>Shopping List Generator App</Typography>
            </Box>

            <FormControlLabel
                control={<Switch checked={isDarkMode} onChange={toggleTheme} />}
                label="Dark Mode"
            />

            <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TextField
                    type="text"
                    value={numMeals}
                    onChange={(e) => setNumMeals(e.target.value)}
                    placeholder="Enter number of meals"
                    variant="outlined"
                    sx={{ marginRight: 1 }}
                    />
                <Button variant="contained" onClick={handleSearch}>
                    Generate New Meals
                </Button>
            </Box>

            <Box sx={{ padding: 2, textAlign: 'center' }}>
                <Button variant="outlined" onClick={() => setFetchImages(!fetchImages)} sx={{ marginRight: 1 }}>
                    {fetchImages ? "Disable Images" : "Enable Images"}
                </Button>
                <Button variant="outlined" onClick={updateMeals}>
                    Update Meals
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {tempMealNames.map((tempMealName, index) => (
                        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', margin: 1 }}>
                            <TextField
                                type="text"
                                value={tempMealName}
                                onChange={(e) => handleMealNameChange(e, index)}
                                sx={{ marginBottom: 1 }}
                                variant="outlined"
                                className="editable-meal-name"
                                />
                            <img src={imageUrls[index]} alt={tempMealName} style={{ width: '100px', height: '100px', objectFit: 'cover' }} className="meal-image" />
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <AutoResizingTextField
                    label="[User]"
                    value={shoppingListPrompt}
                    onChange={(e) => setShoppingListPrompt(e.target.value)}
                    />
                <AutoResizingTextField
                    label="[Bot]"
                    value={result1}
                    onChange={() => {}} // No change handler, as it's read-only
                    />
                <AutoResizingTextField
                    label="[User]"
                    value={shoppingListPrompt2}
                    onChange={(e) => setShoppingListPrompt2(e.target.value)}
                />
                <AutoResizingTextField
                    label="[Bot]"
                    value={result2}
                    onChange={() => {}} // No change handler, as it's read-only
                    />
            </Box>
        </>
    );
};

export default App;
