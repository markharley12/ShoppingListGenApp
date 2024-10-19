import llamaStreamQnA from './createShoppingList.js';
import fetchGoogleImage from './fetchGoogleImage.js';
import placeholderImage from '../images/mealPlaceHolder.webp';

export const fetchBotMessages = async (messages, setBotMessages, llmApiUrl, llmApiKey) => {
    try {
      setBotMessages('');
      for await (const message of llamaStreamQnA(messages, llmApiUrl, llmApiKey)) {
        setBotMessages((prevMessages) => prevMessages + message);
      }
    } catch (error) {
      console.error('Error fetching bot messages:', error);
      setBotMessages('Error fetching data. Please try again.');
    }
  };

export async function fetchMealImages(mealNames, fetchImages, apiKey, cx) {
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
