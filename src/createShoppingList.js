import axios from 'axios';

const DEBUG = true;
const llmApiUrl = "http://localhost:8001/v1/chat/completions"; // Replace with actual LLM API URL from your config
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
            return `<|system|> You are a helpful assistant. </s> <|user|> ${basePrompt} </s> <|assistant|>\n`;
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
            ],
            "stream": true
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
            const chunk = decoder.decode(value, { stream: true }); // Decode chunk as text

            // Split the incoming data into multiple parts in case there are multiple "data: " chunks
            const parts = chunk.split('\n\n'); // Each chunk seems to be separated by two newlines
            
            for (let part of parts) {
                // Ignore empty parts
                if (!part.trim()) continue;
                
                // Remove the "data: " prefix
                const cleanPart = part.trim().replace(/^data:\s*/, '');
            
                if (cleanPart === '[DONE]') break; // End of strea  m

                try {
                    const parsedChunk = JSON.parse(cleanPart);
                    const content = parsedChunk.choices[0].delta.content;
            
                    if (content) {
                        yield content; // Yield the content from each chunk
                    }
                } catch (error) {
                    console.error(`Error parsing JSON in part: ${error}, part: ${cleanPart}`);
                }
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
    console.log(`[User] ${inputStr}`);
    process.stdout.write("[Bot] ")

    for await (const message of llamaStreamQnA(inputStr)) {
            process.stdout.write(JSON.stringify(message));
        }

    console.log("\n\nDone...");
};

// // Uncomment to run the main function
// main();
