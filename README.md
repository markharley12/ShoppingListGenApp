# Shopping List Generator App

This Shopping List Generator App is a React-based web application that allows users to generate a shopping list based on selected meals. The app integrates with Google's Custom Search API to fetch images for each meal, enhancing the user experience by providing visual references. Users have the option to toggle image fetching to optimize performance or accommodate environments without Google API access.

## Features

- Generate a shopping list by selecting the number of meals.
- Fetch and display images for each meal with an option to toggle this feature.
- Update meal selections dynamically.
- Responsive design for optimal viewing on all device sizes.

## Setup

To run this app locally, follow these steps:

### Prerequisites

- Node.js installed on your machine.
- A Google Cloud account with access to the Custom Search API and a configured Custom Search Engine (CSE).

### Installation

Clone the repository:
```bash
git clone https://github.com/your-repository/shopping-list-generator-app.git
```

Navigate to the app directory:
```bash
cd shopping-list-generator-app
```

Install the dependencies:
```bash
npm install
```

Create a .env file in the root of your project and add your Google Cloud API key and Custom Search Engine ID:
```plaintext
REACT_APP_GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key
REACT_APP_CUSTOM_SEARCH_ENGINE_ID=your_custom_search_engine_id
```

Start the app:
```bash
npm start
```
The app will launch in your browser at http://localhost:3000.

Usage
Enter the number of meals for which you want to generate a shopping list.
Click the "Generate New Meals" button to fetch meal names and their images (if image fetching is enabled).
Use the "Update Meals" button if you wish to manually adjust the meal names and regenerate the list.
Toggle the "Enable Images"/"Disable Images" button based on your preference to fetch images for the meals.
Contributing
Contributions to the Shopping List Generator App are welcome. Please follow the standard fork-branch-PR workflow.

Distributed under the MIT License. See LICENSE for more information.

Project Link: https://github.com/markharley12/ShoppingListGenApp
