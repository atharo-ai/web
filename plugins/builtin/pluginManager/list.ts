const listPlugins = () => {
  const plugins = [
    {
      id: "plugin_manager",
      name: "Plugin Manager",
      isInstalled: true,
      isUninstallable: false,
      description:
        "Allows user to manage plugins, including installing and uninstalling them.",
    },
    {
      id: "weather",
      name: "Weather",
      isInstalled: false,
      isInstallable: true,
      description: "Get the current weather in a given location",
    },
  ];
  return JSON.stringify(plugins);
};

export default listPlugins;
