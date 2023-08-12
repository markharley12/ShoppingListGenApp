const fs = require('fs').promises;
const path = require('path');

async function readFileLines(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    return content.split('\n').map(line => line.trim());
}

function fisherYatesShuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // Swap the last element with the chosen one
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

async function selectNDinners(n) {
    const scriptDirectory = __dirname;
    const relativeFilePath = path.join(scriptDirectory, './lists/Dinners.md');
    const dinnerList = await readFileLines(relativeFilePath);
    return fisherYatesShuffle(dinnerList).slice(0, n);
}

function formatListAsSentence(items) {
    if (!items.length) {
        return "";
    } else if (items.length === 1) {
        return items[0];
    } else {
        const lastItem = items[items.length - 1];
        const itemsExceptLast = items.slice(0, -1).join(', ');
        return `${itemsExceptLast}, and ${lastItem}`;
    }
}

async function printTest() {
    const dinners = await selectNDinners(3);
    const formattedDinners = formatListAsSentence(dinners);
    console.log(`I would like to cook the following meals: ${formattedDinners}. What are the ingredients I would need for each of these? Be minimalist and exclude quantities. Group together similar items in the shopping list.`);
    console.log("List just the ingredients in one long list, grouping similar items with subheadings for the item types");
}

printTest();  // Don't forget to call the function to test it
