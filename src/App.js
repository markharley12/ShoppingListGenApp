import React, { useState, useEffect, useCallback } from 'react';
import { fetchBotMessages, sleep, fetchMealImages } from './helperFunctions.js';
import { AutoResizingTextField } from './components.js';
import { selectNDinners, formatListAsSentence, gptShoppingListPrompt, gptShoppingListPrompt2 } from './fetchMeal.js';
import { Box, Button, TextField, Typography, FormControlLabel, Switch } from '@mui/material';
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


    /**
     * Returns a Box component with a centered Typography component 
     * displaying the name of the application.
     * 
     * The Box component has a minimum height of 10vh and takes up the full width of the screen.
     * The Typography component has a font size that scales with the viewport size.
     * The font size calculation is based on the formula: 15px + 2vmin
     * 
     * @returns {ReactElement} A Box component with a centered Typography component
     */
    const renderHeader = () => {
        return (
        <Box sx={{ textAlign: 'center', minHeight: '10vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', boxSizing: 'border-box' }}>
            <Typography variant="h8" sx={{ fontSize: 'calc(15px + 2vmin)' }}>Shopping List Generator App</Typography>
        </Box>
        )
    }
    /**
     * Returns a Box component containing a FormControlLabel that toggles dark mode.
     * 
     * The Box component is a flex box with its content aligned to the right and has a padding of 2.
     * The FormControlLabel component toggles the dark mode state when clicked.
     * The label for the FormControlLabel component is "Dark Mode".
     * 
     * @returns {ReactElement} A Box component containing a FormControlLabel that toggles dark mode.
     */
    const renderThemeToggle = () => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
                <FormControlLabel 
                    control={<Switch checked={isDarkMode} onChange={toggleTheme} />}
                    label="Dark Mode"
                />
            </Box>
        )
    }

    /**
     * Renders a Box component with a centered form for the user to enter
     * the number of meals they want to generate.
     * 
     * The Box component has a fixed height of 6.5rem, a padding of 2rem, 
     * and a display of flex. The form is centered horizontally and 
     * vertically within the Box.
     * 
     * The form consists of a TextField component for the user to enter 
     * the number of meals and a Button component to trigger the generation 
     * of the meals. The TextField component has a type of number, a 
     * placeholder of "Enter number of meals", and an onChange event 
     * handler. The Button component has a variant of contained and an 
     * onClick event handler to trigger the generation of the meals.
     * 
     * The TextField and Button components are spaced evenly within the 
     * Box.
     * 
     * @returns {ReactElement} A Box component with a centered form for generating meals
     */
    const renderMealGenerator = () => {
        return (
            <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'stretch', height: '6.5rem', gap: 1 }}>
                <TextField
                    type="number"
                    value={numMeals}
                    onChange={(e) => setNumMeals(e.target.value)}
                    placeholder="Enter number of meals"
                    variant="outlined"
                    slotProps={{
                        input: {
                            sx: {
                                height: '100%',
                                textAlign: 'center',
                                '& input': {
                                    height: '100%',
                                    textAlign: 'center',
                                }
                            }
                        }
                    }}
                    />
                <Button variant="contained" onClick={handleSearch} sx={{ height: '100%' }}>
                    Generate New Meals
                </Button>
            </Box>
        )
    }

    /**
     * Renders a row of buttons for toggling image fetching and updating the meals.
     * 
     * The first button toggles image fetching on and off, and the second button
     * triggers the generation of new meals.
     * 
     * The buttons are centered horizontally and have a padding of 2rem.
     * 
     * @returns {ReactElement} A row of buttons for toggling image fetching and updating the meals
     */
    const renderImageToggle = () => {
        return (
            <Box sx={{ padding: 2, textAlign: 'center' }}>
                <Button variant="outlined" onClick={() => setFetchImages(!fetchImages)} sx={{ marginRight: 1 }}>
                    {fetchImages ? "Disable Images" : "Enable Images"}
                </Button>
                <Button variant="outlined" onClick={updateMeals}>
                    Update Meals
                </Button>
            </Box>
        )
    }

    /**
     * A function that renders a row of meal images.
     * 
     * It takes in the temporary meal names and URLs of the meal images,
     * and renders a row of images with editable text fields above each image.
     * 
     * The images are displayed in a flex box with a flex direction of 'row' and flex wrap set to 'wrap'.
     * The images are centered and have a margin of 1.
     * 
     * The text fields are also centered and have a margin bottom of 1.
     * The text fields are editable and have a variant of 'outlined'.
     * 
     * The function also applies a class name of 'editable-meal-name' to the text fields and 'meal-image' to the images.
     * 
     * @returns {ReactElement} A Box component with a flex box inside that renders the meal images and text fields.
     */
    const renderMealImageRow = () => {
        return (
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
        )
    }

    /**
     * Returns a Box component that renders a vertical column of AutoResizingTextFields
     * for the user to input their prompts and the bot to output its responses.
     *
     * The first AutoResizingTextField is for the user to input their first prompt.
     * The second AutoResizingTextField is read-only and displays the bot's response to the user's first prompt.
     * The third AutoResizingTextField is for the user to input their second prompt.
     * The fourth AutoResizingTextField is read-only and displays the bot's response to the user's second prompt.
     *
     * The AutoResizingTextFields are all centered horizontally and have a width of 95% of the parent.
     * The padding is set to 2 on all sides.
     *
     * @returns {ReactElement} A Box component with four AutoResizingTextFields
     */
    const renderShoppingList = () => {
        return (
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
        )
    }

    return (
        <>
            {renderHeader()}

            {renderThemeToggle()}

            {renderMealGenerator()}

            {renderImageToggle()}

            {renderMealImageRow()}

            {renderShoppingList()}
        </>
    );
};

export default App;
