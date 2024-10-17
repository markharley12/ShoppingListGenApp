import llamaStreamQnA from './createShoppingList.js';
import fetchGoogleImage from './fetchGoogleImage.js';
import placeholderImage from '../images/mealPlaceHolder.webp';

const apiKey = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;
const cx = process.env.REACT_APP_CUSTOM_SEARCH_ENGINE_ID;

export const fetchBotMessages = async (prompt, setBotMessages, llmApiUrl, llmApiKey) => {
  try {
      setBotMessages('');
      for await (const message of llamaStreamQnA(prompt, llmApiUrl, llmApiKey)) {
          setBotMessages((prevMessages) => prevMessages + message);
      }
    } catch (error) {
      console.error('Error fetching bot messages:', error);
      setBotMessages('Error fetching data. Please try again.');
    }
  };

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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