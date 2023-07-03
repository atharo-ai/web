import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || "",
});
const openai = new OpenAIApi(configuration);

const pluginList = (args: string) => {
  const parsedArgs = JSON.parse(args);
  const plugins = [
    {
      name: "weather",
      installed: false,
      description: "Get the current weather in a given location",
    },
  ];
  if (parsedArgs?.installedFilter == "installed") {
    return JSON.stringify(plugins.filter((p) => p.installed));
  } else if (parsedArgs?.installedFilter == "uninstalled") {
    return JSON.stringify(plugins.filter((p) => !p.installed));
  } else {
    return JSON.stringify(plugins);
  }
};

const addPlugin = () => {};

const removePlugin = () => {};

const chatCompletion = async () => {
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `
          Your name is Atharo.
          Only use functions you are provided with.
          For a full list of plugins, they can access atharo.com/plugins.
        `,
    },
    {
      role: "user",
      content: "Hello, what plugins do I have installed?",
    },
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages,
    functions: [
      {
        name: "list_plugins",
        description: "List all plugins available to use.",
        parameters: {
          type: "object",
          properties: {
            installedFilter: {
              type: "string",
              description:
                "Only show installed plugins, uninstalled plugins, or all plugins",
              enum: ["installed", "uninstalled", "all"],
            },
          },
          required: ["type"],
        },
      },
    ],
  });

  const message = response?.data?.choices?.[0]?.message;
  if (!message) return;
  messages.push(message);
  let result = response;

  const functionCall = message?.function_call;
  if (functionCall) {
    if (functionCall.name == "list_plugins") {
      messages.push({
        role: "function",
        name: functionCall.name,
        content: pluginList(functionCall.arguments || "{}"),
      });
      result = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        messages,
      });
    }
  }

  console.log(result);

  return result;
};

export default chatCompletion;
