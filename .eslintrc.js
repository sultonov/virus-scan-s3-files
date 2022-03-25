module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "@typescript-eslint"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "rules": {
        "curly": "error",
        "keyword-spacing": "error",
        "object-curly-spacing": ["warn", "always"],
        "quotes": "error",
        "sort-imports": "error",
        "@typescript-eslint/no-empty-function": "off"
    }
}
