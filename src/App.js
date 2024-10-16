import React, { useState, useEffect, useCallback } from 'react';
import { fetchBotMessages, sleep, fetchMealImages } from './helpers/helperFunctions';
import {
  selectNDinners,
  formatListAsSentence,
  gptShoppingListPrompt,
  gptShoppingListPrompt2,
  gptMacroPrompt,
} from './helpers/fetchMeal';

import Header from './components/Header';
import MealGenerator from './components/MealGenerator';
import ImageToggle from './components/ImageToggle';
import MealImageRow from './components/MealImageRow';
import ShoppingList from './components/ShoppingList';
import MacrosDisplay from './components/MacrosDisplay';
import Settings from './components/Settings';
import { useSelector } from 'react-redux';
const App = () => {
  const [numMeals, setNumMeals] = useState('');
  const [mealNames, setMealNames] = useState([]);
  const [tempMealNames, setTempMealNames] = useState([]);
  const [shoppingListPrompt, setShoppingListPrompt] = useState('');
  const [shoppingListPrompt2, setShoppingListPrompt2] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [result1, setResult1] = useState('');
  const [result2, setResult2] = useState('');
  const fetchImages = useSelector((state) => state.settings.fetchImages);
  const [macros, setMacros] = useState('');

  const llmApiUrl = useSelector((state) => state.settings.llmApiUrl);
  const llmApiKey = useSelector((state) => state.settings.llmApiKey);

  const prompt2 = useCallback(() => {
    return `My shopping list is: ${result1}\n\n Task:\n${shoppingListPrompt2}`;
  }, [result1, shoppingListPrompt2]);

  const handlePrompts = useCallback(async () => {
    if (result1 && result1 !== 'slot unavailable' && shoppingListPrompt2) {
      console.log('Ready to process with updated prompts');
      console.log('Waiting 5 secs for LLM API to refresh');
      await sleep(5000);

      await fetchBotMessages(prompt2(), setResult2, llmApiUrl, llmApiKey);
    }
  }, [result1, shoppingListPrompt2, prompt2]);

  useEffect(() => {
    handlePrompts();
  }, [handlePrompts]);

  const updateMeals = async () => {
    try {
      setMealNames(tempMealNames);
      const mealNamesSentence = formatListAsSentence(tempMealNames);
      const shoppingPrompt = gptShoppingListPrompt(mealNamesSentence);
      setShoppingListPrompt(shoppingPrompt);

      const urls = await fetchMealImages(tempMealNames, fetchImages);
      setImageUrls(urls);

      // Fetch shopping list
      await fetchBotMessages(shoppingPrompt, setResult1, llmApiUrl, llmApiKey);

      setShoppingListPrompt2(gptShoppingListPrompt2());

      // Fetch macros
      const macroPrompt = gptMacroPrompt(mealNamesSentence);
      await fetchBotMessages(macroPrompt, setMacros, llmApiUrl, llmApiKey);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = async () => {
    const numDinners = parseInt(numMeals, 10);

    if (!isNaN(numDinners) && numDinners > 0) {
      try {
        const dinners = await selectNDinners(numDinners, './lists/Dinners.md');
        setMealNames(dinners);
        setTempMealNames(dinners);
        const mealNamesSentence = formatListAsSentence(dinners);
        const shoppingPrompt = gptShoppingListPrompt(mealNamesSentence);
        setShoppingListPrompt(shoppingPrompt);

        const urls = await fetchMealImages(dinners, fetchImages);
        setImageUrls(urls);

        // Fetch shopping list
        await fetchBotMessages(shoppingPrompt, setResult1, llmApiUrl, llmApiKey);

        setShoppingListPrompt2(gptShoppingListPrompt2());

        // Fetch macros
        const macroPrompt = gptMacroPrompt(mealNamesSentence);
        await fetchBotMessages(macroPrompt, setMacros, llmApiUrl, llmApiKey);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const fetchMacros = async () => {
    try {
      const mealNamesSentence = formatListAsSentence(tempMealNames);
      const macroPrompt = gptMacroPrompt(mealNamesSentence);
      await fetchBotMessages(macroPrompt, setMacros, llmApiUrl, llmApiKey);
    } catch (error) {
      console.error('Error fetching macros:', error);
    }
  };

  const handleMealNameChange = (event, index) => {
    const updatedTempMealNames = [...tempMealNames];
    updatedTempMealNames[index] = event.target.value;
    setTempMealNames(updatedTempMealNames);
  };

  return (
    <>
      <Header />
      <Settings/>
      <MealGenerator numMeals={numMeals} setNumMeals={setNumMeals} handleSearch={handleSearch} />
      <ImageToggle
        updateMeals={updateMeals}
        fetchMacros={fetchMacros}
      />
      <MealImageRow
        tempMealNames={tempMealNames}
        imageUrls={imageUrls}
        handleMealNameChange={handleMealNameChange}
      />
      <ShoppingList
        shoppingListPrompt={shoppingListPrompt}
        setShoppingListPrompt={setShoppingListPrompt}
        result1={result1}
        shoppingListPrompt2={shoppingListPrompt2}
        setShoppingListPrompt2={setShoppingListPrompt2}
        result2={result2}
      />
      <MacrosDisplay macros={macros} />
    </>
  );
};

export default App;
