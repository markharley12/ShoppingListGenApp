import axios from 'axios';
// import fs from 'fs';

const BASE_URL = 'https://www.googleapis.com/customsearch/v1';
const SEARCH_TYPE = 'image';
// const IMAGE_CACHE_FILE = './lists/imageCache.json';

// function readImageCache() {
//   try {
//     // const data = fs.readFileSync(IMAGE_CACHE_FILE, 'utf8');
//     console.log("Cached image found")
//     return JSON.parse(data);
//   } catch (error) {
//     console.log("Image not found in cache")
//     return {}; // Return an empty object if the file doesn't exist or an error occurs
//   }
// }

function readImageCache() {
  const data = localStorage.getItem('imageCache');
    return data ? JSON.parse(data) : {};
}

function writeImageCache(imageCache) {
  localStorage.setItem('imageCache', JSON.stringify(imageCache));
}



const fetchGoogleImage = async (searchWord, apiKey, cx) => {
  const imageCache = readImageCache();
  if (imageCache[searchWord]) {
    console.log("Image retreived from cache")
    return imageCache[searchWord];
  }


  try {
    const url = `${BASE_URL}?searchType=${SEARCH_TYPE}&q=${encodeURIComponent(searchWord)}&cx=${cx}&key=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.items && response.data.items.length > 0) {
      const imageUrl = response.data.items[0].link;
      imageCache[searchWord] = imageUrl;
      writeImageCache(imageCache); // Write to cache using the new function
      // fs.writeFileSync(IMAGE_CACHE_FILE, JSON.stringify(imageCache)); // Write to file
      console.log("Image written to cache")
      return imageUrl;
    } else {
      throw new Error('No images found for the given search term.');
    }
  } catch (error) {
    throw new Error(`Failed to fetch images from Google Images: ${error.message}`);
  }
};

export default fetchGoogleImage;
