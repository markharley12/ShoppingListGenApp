const DEBUG = true;
const LLM_API_URL = process.env.REACT_APP_LLM_API_URL;
const LLM_API_KEY = process.env.REACT_APP_LLM_API_KEY;
let modelType = "zephyr";  // or "CodeLlama"

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

const createInputJson = (input) => {
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
        temperature : 0.2,
        max_tokens : 2048,
        top_p : 0.8,
        stream: true
    };
};

const llamaStreamRequest = async function* (payload) {
    if (DEBUG) {
        console.log(`${LLM_API_URL} : HTTP request POST : ${JSON.stringify(payload)}`);
    }
    try {
        const response = await fetch(LLM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LLM_API_KEY}`,
            },
            body: JSON.stringify(payload),
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
                // Ignore empty parts or parts that start with ": ping"
                if (!part.trim() || part.startsWith(': ping')) continue;
                
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
export default async function* llamaStreamQnA(input) {
    const prompt = wrapPrompt(input);
    const request = createInputJson(prompt);

    for await (const message of llamaStreamRequest(request)) {
        yield message;
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
