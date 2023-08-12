import { promises as fs } from 'fs';
import path from 'path';

/**
 * Reads lines from a file.
 * @param {string} filePath - Path to the file.
 * @returns {Promise<string[]>} Array of lines.
 */
async function readFileLines(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return content.split('\n').map(line => line.trim());
    } catch (error) {
        console.error(`Error reading file at ${filePath}:`, error);
        return [];
    }
}

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
 * @param {string} filePath - Path to the dinners list file.
 * @returns {Promise<string[]>} n selected dinners.
 */
async function selectNDinners(n, filePath) {
    const dinnerList = await readFileLines(filePath);
    return fisherYatesShuffle(dinnerList).slice(0, n);
}

/**
 * Formats an array of items as an English list sentence.
 * @param {string[]} items - Items to be formatted.
 * @returns {string} Formatted sentence.
 */
function formatListAsSentence(items) {
    if (!items.length) return "";
    if (items.length === 1) return items[0];
    const lastItem = items.pop();
    return `${items.join(', ')}, and ${lastItem}`;
}

async function printTest() {
    const scriptDirectory = path.resolve();
    const filePath = path.join(scriptDirectory, './lists/Dinners.md');
    const dinners = await selectNDinners(3, filePath);
    const formattedDinners = formatListAsSentence(dinners);
    console.log(`I would like to cook the following meals: ${formattedDinners}. What are the ingredients I would need for each of these? Be minimalist and exclude quantities. Group together similar items in the shopping list.`);
    console.log("List just the ingredients in one long list, grouping similar items with subheadings for the item types");
}

printTest();
