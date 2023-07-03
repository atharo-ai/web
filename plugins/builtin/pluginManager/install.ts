type PluginInstallArgs = {
  pluginName: string;
};
const installPlugin = ({ pluginName }: PluginInstallArgs) => {
  return JSON.stringify({
    name: pluginName,
    success: true,
  });
};

export default installPlugin;
