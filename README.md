# Shopping List Generator App
This Shopping List Generator App is a React-based web application that allows users to generate a shopping list based on selected meals. The app integrates with:

- Google's Custom Search API: Fetches images for each meal, enhancing the user experience by providing visual references.
- Language Model API: Generates shopping lists and macronutrient information (proteins, carbohydrates, fats) for each meal.
Users have the option to toggle image fetching to optimize performance or accommodate environments without Google API access.

## Features
- Generate Shopping Lists: Create a shopping list by selecting the number of meals.
- Meal Images: Fetch and display images for each meal with an option to toggle this feature.
- Macronutrient Information: Generate macronutrient breakdowns (proteins, carbohydrates, fats) for each meal.
- Dynamic Meal Selection: Update meal selections manually and regenerate lists.
- Responsive Design: Optimized for viewing on all device sizes.
## Setup
To run this app locally, follow these steps:

### Prerequisites
- Node.js: Install the latest version from nodejs.org.
Google Cloud Account:
Custom Search API Access: Enable the Custom Search API in your Google Cloud Console.
Custom Search Engine (CSE): Create and configure a Custom Search Engine.
- Language Model API Access:
    - API Endpoint: Access to a Language Model API endpoint capable of processing chat completions (e.g., OpenAI's GPT API or a locally hosted LLM API).
    - API Key: If required by your LLM API, obtain an API key or token.
### Installation
1. Clone the repository:

```bash
git clone https://github.com/markharley12/ShoppingListGenApp.git
```
2. Navigate to the app directory:

```bash
cd ShoppingListGenApp
```
3. Install the dependencies:

```bash
npm install
```
4. Set Up Environment Variables:

Create a .env file in the root of your project and add your environment variables:

```plaintext
REACT_APP_GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key
REACT_APP_CUSTOM_SEARCH_ENGINE_ID=your_custom_search_engine_id
REACT_APP_LLM_API_URL=your_llm_api_url
```
- **REACT_APP_GOOGLE_CLOUD_API_KEY**: Your Google Cloud API key.
- **REACT_APP_CUSTOM_SEARCH_ENGINE_ID**: Your Custom Search Engine ID.
- **REACT_APP_LLM_API_URL**: The URL of your Language Model API endpoint (e.g., https://api.openai.com/v1/chat/completions or your locally hosted endpoint).
Note: If your LLM API requires authentication (e.g., API key or token), you may need to include additional environment variables or configure headers in your API calls accordingly.

### Starting the App
Start the app by running:

```bash
npm start
```
The app will launch in your browser at http://localhost:3000.

### Usage
1. Generate Meals:

- Enter the number of meals for which you want to generate a shopping list.
- Click the "Generate New Meals" button to fetch meal names and their images (if image fetching is enabled).
2. Update Meals:

- Manually adjust the meal names if desired.
- Click the "Update Meals" button to regenerate the shopping list and macronutrient information based on the updated meals.
3. Toggle Images:

- Use the "Enable Images" or "Disable Images" button to toggle image fetching for meals.
4. Fetch Macros:

- Click the "Fetch Macros" button to retrieve macronutrient information (proteins, carbohydrates, fats) for the selected meals.
5. View Results:

- Shopping List: The generated shopping list will be displayed in the shopping list section.
- Macronutrient Information: The macronutrient breakdown for each meal will be displayed in the macros section.
## Contributing
Contributions to the Shopping List Generator App are welcome. Please follow the standard fork-branch-PR (Pull Request) workflow:

1. Fork the repository to your GitHub account.

2. Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/YourFeatureName
```
3. Commit your changes:

```bash
git commit -m "Description of your changes"
```
4. Push to your forked repository:

```bash
git push origin feature/YourFeatureName
```
5. Create a Pull Request from your branch to the main repository.
License
Distributed under the MIT License. See LICENSE file for more information.

Contact
For any questions or suggestions, please open an issue on the GitHub repository.

Project Link
[Shopping List Generator App Repository](https://github.com/markharley12/ShoppingListGenApp)