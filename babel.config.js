module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // newly added code below to try fixing navigating before mounting root layout error
    // reference: https://dev.to/aaronksaunders/expo-router-tab-navigation-from-the-docs-3c38
  };
};
