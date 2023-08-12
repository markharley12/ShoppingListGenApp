import axios from 'axios';

const BASE_URL = 'https://www.googleapis.com/customsearch/v1';
const SEARCH_TYPE = 'image';

const fetchGoogleImage = async (searchWord, apiKey, cx) => {
  try {
    const url = `${BASE_URL}?searchType=${SEARCH_TYPE}&q=${encodeURIComponent(searchWord)}&cx=${cx}&key=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0].link;
    } else {
      throw new Error('No images found for the given search term.');
    }
  } catch (error) {
    throw new Error(`Failed to fetch images from Google Images: ${error.message}`);
  }
};

export default fetchGoogleImage;
