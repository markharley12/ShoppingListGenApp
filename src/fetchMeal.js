const dinnerList = require('./lists/Dinners.json');

/**
 * Shuffles an array using Fisher-Yates algorithm.
 * @param {T[]} array - Array to be shuffled.
 * @returns {T[]} Shuffled array.
 */
function fisherYatesShuffle(array) {
    let counter = array.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

/**
 * Selects n random dinners from a list in a file.
 * @param {number} n - Number of dinners to select.
 * @returns {Promise<string[]>} n selected dinners.
 */
export async function selectNDinners(n) {
    return fisherYatesShuffle(dinnerList).slice(0, n);
}

/**
 * Formats an array of items as an English list sentence.
 * @param {string[]} items - Items to be formatted.
 * @returns {string} Formatted sentence.
 */
export function formatListAsSentence(items) {
    if (!items.length) return "";
    if (items.length === 1) return items[0];
    const lastItem = items.pop();
    return `${items.join(', ')}, and ${lastItem}`;
}

export function gptShoppingListPrompt(formattedDinners) {
    return `I would like to cook the following meals: ${formattedDinners}. What are the ingredients I would need for each of these? Be minimalist and exclude quantities. Group together similar items in the shopping list.`
}

export function gptShoppingListPrompt2() {
    return "List just the ingredients in one long list, grouping similar items with subheadings for the item types"
}

async function printTest() {
    const dinners = await selectNDinners(3);
    const formattedDinners = formatListAsSentence(dinners);
    console.log(gptShoppingListPrompt(formattedDinners));
    console.log(gptShoppingListPrompt2());
}

printTest();
