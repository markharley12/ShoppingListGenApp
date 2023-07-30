import axios from 'axios';

const GoogleImageComponent = async (searchWord, apiKey, cx) => {
  try {
    const formattedSearchWord = searchWord.replace(' ', '+');

    const url = `https://www.googleapis.com/customsearch/v1?searchType=image&q=${formattedSearchWord}&cx=${cx}&key=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.items && response.data.items.length > 0) {
      const imageUrl = response.data.items[0].link;
      return imageUrl;
    } else {
      throw new Error('No images found.');
    }
  } catch (error) {
    throw new Error('Failed to fetch images from Google Images.');
  }
};

export default GoogleImageComponent;
