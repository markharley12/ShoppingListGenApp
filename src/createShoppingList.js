import axios from 'axios';

const DEBUG = false;
const llmApiUrl = "http://localhost:8001/completion"; // Replace with actual LLM API URL from your config
let modelType = "zephyr";  // or "CodeLlama"

const parseStreamStringToJson = (streamString) => {
    try {
        const removePrefix = streamString.substring(6);
        return JSON.parse(removePrefix);
    } catch (e) {
        console.error(`Error parsing JSON from line: ${e}`);
    }
};

const wrapPrompt = (basePrompt) => {
    switch(modelType) {
        case "zephyr":
            return `<|system|> You are a helpful assistant. </s> <|user|> ${basePrompt} </s> <|assistant|>`;
        case "CodeLlama":
            return `
[INST] Write code to solve the following coding problem that obeys the constraints and passes the example test cases. Please wrap your code answer using \`\`\`:
${basePrompt}
[/INST]
`;
        default:
            return basePrompt;
    }
};

const getInputJson = (input) => {
    // Replace this condition with your actual condition or configuration
    if (llmApiUrl === "http://localhost:8001/v1/chat/completions") {
        return {
            messages: [
                {
                    content: "You are a helpful assistant.",
                    role: "system"
                },
                {
                    content: input,
                    role: "user"
                }
            ]
        };
    } else {
        return {
            prompt: input,
            max_tokens: 512,
            stream: true
        };
    }
};

const llamaStreamRequest = async function* (payload) {
    if (DEBUG) {
        console.log(`${llmApiUrl} : HTTP request POST : ${JSON.stringify(payload)}`);
    }
    try {
        const response = await fetch(llmApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any other necessary headers here
            },
            body: JSON.stringify(payload)
        });

        // Ensure the response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Use the reader from the response's body to read the stream
        const reader = response.body.getReader();
        let decoder = new TextDecoder();

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            let chunk = decoder.decode(value, {stream: true}); // Decode chunk as text
            // Process the chunk using your parseStreamStringToJson function
            let jsonContent = parseStreamStringToJson(chunk).content;
            if (jsonContent) {
                yield jsonContent; // Yield the JSON content
            }
        }
    } catch (e) {
        console.error(`An error occurred in llamaStreamRequest: ${e}`);
    }
};

// Modify llamaStreamQnA to be an async generator
export default async function* llamaStreamQnA(question) {
    for await (const messageStream of llamaStreamRequest(getInputJson(wrapPrompt(question)))) {
        // process.stdout.write(messageStream);
        // console.log(messageStream);
        yield messageStream;  // Use yield to provide values to the for-await-of loop
    }
}

// Main function to demonstrate usage
const main = async () => {
    const inputStr="print hello world in python"
    // const inputStr="I would like to cook the following meals: Crispy baked tofu with sesame noodles, and Vegetable lasagna with garlic bread. What are the ingredients I would need for each of these? Be minimalist and exclude quantities. Group together similar items in the shopping list."
    console.log(`[User] ${inputStr}`);
    process.stdout.write("[Bot] ")

    for await (const message of llamaStreamQnA(inputStr)) {
            process.stdout.write(JSON.stringify(message));
        }

    console.log("\n\nDone...");
};

// // Uncomment to run the main function
// main();
