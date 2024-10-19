import React, { useState, useCallback } from 'react';
import { fetchBotMessages, fetchMealImages } from './helpers/helperFunctions';
import {
  selectNDinners,
  formatListAsSentence,
  gptShoppingListPrompt,
  gptShoppingListPrompt2,
  gptMacroPrompt,
} from './helpers/fetchMeal';

import Header from './components/Header';
import MealGenerator from './components/MealGenerator';
import MealUpdateButtons from './components/MealUpdateButtons';
import MealImageRow from './components/MealImageRow';
import ShoppingList from './components/ShoppingList';
import MacrosDisplay from './components/MacrosDisplay';
import Settings from './components/Settings';
import { useSelector } from 'react-redux';
const App = () => {
  const [numMeals, setNumMeals] = useState('');
  const [mealNames, setMealNames] = useState([]);
  const [shoppingListPrompt, setShoppingListPrompt] = useState('');
  const [shoppingListPrompt2, setShoppingListPrompt2] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [result1, setResult1] = useState('');
  const [result2, setResult2] = useState('');
  const fetchImages = useSelector((state) => state.settings.fetchImages);
  const [macros, setMacros] = useState('');

  const llmApiUrl = useSelector((state) => state.settings.llmApiUrl);
  const llmApiKey = useSelector((state) => state.settings.llmApiKey);
  const apiKey = useSelector((state) => state.settings.apiKey);
  const cx = useSelector((state) => state.settings.cx);

  const handlePrompts = async (shoppingListPrompt, result1) => {
    const prompt2 = gptShoppingListPrompt2()
    setShoppingListPrompt2(prompt2);

    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: shoppingListPrompt },
      { role: 'assistant', content: result1 },
      { role: 'user', content: prompt2 }
    ];

    await fetchBotMessages(messages, setResult2, llmApiUrl, llmApiKey);
  };

  const updateMealsLogic = async (meals) => {
    try {
      const mealNamesSentence = formatListAsSentence(meals);
      const shoppingPrompt = gptShoppingListPrompt(mealNamesSentence);
      setShoppingListPrompt(shoppingPrompt);

      const urls = await fetchMealImages(mealNames, fetchImages, apiKey, cx);
      setImageUrls(urls);

      const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: shoppingPrompt },
      ];

      // Fetch shopping list
      await fetchBotMessages(messages, setResult1, llmApiUrl, llmApiKey);

      await handlePrompts(shoppingPrompt, result1);

      await fetchMacros(shoppingPrompt, result1, shoppingListPrompt2, result2);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const updateMeals = async () => {
    updateMealsLogic(mealNames);
  };

  const handleSearch = async () => {
    const numDinners = parseInt(numMeals, 10);

    if (!isNaN(numDinners) && numDinners > 0) {
      try {
        const dinners = await selectNDinners(numDinners, './lists/Dinners.md');
        setMealNames(dinners);
        updateMealsLogic(dinners);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const fetchMacrosButton = useCallback(async () => {
    fetchMacros(shoppingListPrompt, result1, shoppingListPrompt2, result2)
  }, [shoppingListPrompt, result1, shoppingListPrompt2, result2, mealNames, llmApiUrl, llmApiKey, setMacros]);

  const fetchMacros = async (shoppingListPrompt, result1, shoppingListPrompt2, result2) => {
    try {
      const mealNamesSentence = formatListAsSentence(mealNames);
      const macroPrompt = gptMacroPrompt(mealNamesSentence);

      const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: shoppingListPrompt },
        { role: 'assistant', content: result1 },
        { role: 'user', content: shoppingListPrompt2 },
        { role: 'assistant', content: result2 },
        { role: 'user', content: macroPrompt }
      ];

      await fetchBotMessages(messages, setMacros, llmApiUrl, llmApiKey);
    } catch (error) {
      console.error('Error fetching macros:', error);
    }
  };


  const handleMealNameChange = (event, index) => {
    const updatedmealNames = [...mealNames];
    updatedmealNames[index] = event.target.value;
    setMealNames(updatedmealNames);
  };

  return (
    <>
      <Header />
      <Settings/>
      <MealGenerator numMeals={numMeals} setNumMeals={setNumMeals} handleSearch={handleSearch} />
      <MealUpdateButtons
        updateMeals={updateMeals}
        fetchMacros={fetchMacrosButton}
      />
      <MealImageRow
        mealNames={mealNames}
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
