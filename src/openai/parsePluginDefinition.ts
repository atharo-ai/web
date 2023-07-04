import yaml from "js-yaml";
import { type ChatCompletionFunctions } from "openai";

type PluginDefinition = {
  version: number;
  id: string;
  name: string;
  description: string;
  features: {
    [key: string]: {
      description: string;
      example: string;
      entry: string;
      parameters: {
        [key: string]: {
          description: string;
          type: string;
          required: boolean;
          options?: string[];
        };
      }[];
    };
  };
};

const parsePluginDefinition = (str?: string) => {
  const pluginDefinition = yaml.load(`
version: 1
id: pluginManager
name: Plugin Manager
description: Manage your plugins, including installing and uninstalling.
features:
  list:
    description: List all available plugins
    example: What plugins do you have?
    entry: list.ts
    parameters:
      isInstalled:
        description: If the plugin is ready to be used by Atharo.
        type: boolean
        required: true
      isInstallable:
        description: If the plugin can be installed.
        type: boolean
        required: true
        `) as PluginDefinition;

  return Object.entries(pluginDefinition.features).map<ChatCompletionFunctions>(
    ([commandId, commandDefinition]) => ({
      name: `${pluginDefinition.id}-${commandId}`,
      description: commandDefinition.description,
      parameters: {
        type: "object",
        properties: Object.entries(commandDefinition.parameters).reduce(
          (acc, [parameterName, parameterDefinition]) => ({
            ...acc,
            [parameterName]: {
              type: parameterDefinition.type,
              description: parameterDefinition.description,
            },
          }),
          {}
        ),
        required: Object.entries(commandDefinition.parameters)
          .map(([parameterName, parameterDefinition]) =>
            parameterDefinition.required ? parameterName : null
          )
          .filter(Boolean),
      },
    })
  );
};

export default parsePluginDefinition;
