type PluginUninstall = {
  pluginName: string;
};
const uninstallPlugin = ({ pluginName }: PluginUninstall) => {
  return JSON.stringify({
    name: pluginName,
    success: true,
  });
};

export default uninstallPlugin;
