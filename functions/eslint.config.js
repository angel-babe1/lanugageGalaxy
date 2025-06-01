// functions/eslint.config.js
import globals from "globals"; // Убедитесь, что установлен: npm install globals --save-dev

export default [
  {
    files: ["**/*.js", "**/*.mjs"], // Применяем ко всем JS/MJS файлам в текущей директории и поддиректориях
    languageOptions: {
      ecmaVersion: 2022, // или "latest"
      sourceType: "module",
      globals: {
        ...globals.node, // <--- Это должно определить Buffer и другие Node.js глобалы
        // ...globals.es2021, // Если нужны глобалы из конкретной версии ES
        // Если вы используете специфичные для Firebase Functions глобалы, их можно добавить здесь
        // например, 'functions': 'readonly' (хотя обычно это импортируется)
      },
    },
    rules: {
      // Ваши правила
      "indent": ["error", 2],
      "semi": ["error", "always"], // Пример правила
      "quotes": ["error", "double"], // Пример правила
      "no-undef": "error", // Убедитесь, что это правило включено, чтобы видеть ошибки undefined
      // "require-jsdoc": 0, // Если вы использовали это правило
      // "object-curly-spacing": ["error", "always"], // Если вы использовали это правило
    },
  },
  // Если вы хотите использовать eslint:recommended (требует @eslint/js)
  // (async () => {
  //   const js = await import("@eslint/js"); // Установите: npm install @eslint/js --save-dev
  //   return js.configs.recommended;
  // })(),
];