module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"], // Adjust based on your folder structure
          alias: {
            "@": "./src", // Use '@' to reference the `src` folder
          },
        },
      ],
    ],
  };
};
