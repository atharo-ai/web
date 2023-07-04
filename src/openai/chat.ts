import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai";
import parsePluginDefinition from "./parsePluginDefinition";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || "",
});
const openai = new OpenAIApi(configuration);

const chatCompletion = async () => {
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `
          Your name is Atharo, an assistant that uses plugins. You do not help with tasks beyond your plugins.
          Only use functions you are provided with.
          For a full list of plugins, you can visit atharo.com/plugins.
        `,
    },
    {
      role: "user",
      content: "Hello, who are you?",
    },
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages,
    functions: parsePluginDefinition(),
  });

  const message = response?.data?.choices?.[0]?.message;
  if (!message) return;
  messages.push(message);
  const result = response;

  const functionCall = message?.function_call;
  if (functionCall) {
    console.log(functionCall);
    // if (functionCall.name == "list_plugins") {
    //   messages.push({
    //     role: "function",
    //     name: functionCall.name,
    //     content: pluginList(functionCall.arguments || "{}"),
    //   });
    //   result = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo-0613",
    //     messages,
    //   });
    // } else if (functionCall.name == "install_plugin") {
    //   messages.push({
    //     role: "function",
    //     name: functionCall.name,
    //     content: addPlugin(functionCall.arguments || "{}"),
    //   });
    //   result = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo-0613",
    //     messages,
    //   });
    // }
  }

  return result;
};

export default chatCompletion;
