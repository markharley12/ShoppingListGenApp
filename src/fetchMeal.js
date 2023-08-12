// fetchMeal.js

const fs = require('fs');
const path = require('path');

function read_file_lines(file_path) {
    const content = fs.readFileSync(file_path, 'utf-8');
    const lines = content.split('\n').map(line => line.trim());
    return lines;
}

function randomSample(arr, n) {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

function select_n_dinners(n) {
    const script_directory = __dirname;
    const relative_file_path = path.join(script_directory, './lists/Dinners.md');
    const dinner_list = read_file_lines(relative_file_path);
    return randomSample(dinner_list, n);
}

function formatListAsSentence(items) {
    if (!items.length) {
        return "";
    } else if (items.length === 1) {
        return items[0];
    } else {
        const last_item = items[items.length - 1];
        const items_except_last = items.slice(0, -1).join(', ');
        return `${items_except_last}, and ${last_item}`;
    }
}

function printTest() {
    dinners = select_n_dinners(3)
    formattedDinners = formatListAsSentence(dinners);
    console.log(`I would like to cook the following meals: ${formattedDinners}. What are the ingredients I would need for each of these? Be minimalist and exclude quantities. Group together similar items in the shopping list.`);
    console.log("List just the ingredients in one long list, grouping similar items with subheadings for the item types")
}
