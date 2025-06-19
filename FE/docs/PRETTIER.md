# Project Documentation

## Code Formatting

This project uses [Prettier](https://prettier.io/) to enforce consistent code formatting. The following rules are applied to the codebase:

### Prettier Configuration Rules

1. **`semi: true`**  
   Enforces the use of semicolons at the end of statements.

   - **Correct**: `const x = 10;`
   - **Incorrect**: `const x = 10`

2. **`singleQuote: true`**  
   Prefers single quotes (`'`) over double quotes (`"`).

   - **Correct**: `const name = 'John';`
   - **Incorrect**: `const name = "John";`

3. **`jsxSingleQuote: false`**  
   In JSX, prefer double quotes (`"`) over single quotes (`'`) for attributes.

   - **Correct**: `<div className="container">`
   - **Incorrect**: `<div className='container'>`

4. **`bracketSpacing: true`**  
   Ensures spaces are included between brackets in object literals.

   - **Correct**: `const obj = { key: 'value' };`
   - **Incorrect**: `const obj = {key: 'value'};`

5. **`trailingComma: "all"`**  
   Enforces trailing commas in multi-line objects, arrays, and function parameters.

   - **Correct**:
     ```javascript
     const array = [1, 2, 3];
     ```
   - **Incorrect**:
     ```javascript
     const array = [1, 2, 3];
     ```

6. **`printWidth: 80`**  
   Sets the maximum line length to 80 characters. Lines exceeding this limit will be wrapped.

   - **Correct**:
     ```javascript
     const longString =
       "This is a long string that will automatically wrap to the next line.";
     ```
   - **Incorrect**:
     ```javascript
     const longString =
       "This is a long string that will exceed the maximum line length set by Prettier and will need to be wrapped manually.";
     ```

7. **`tabWidth: 2`**  
   Sets the number of spaces per tab to 2.

   - **Correct**:
     ```javascript
     function example() {
       const x = 10;
     }
     ```
   - **Incorrect**:
     ```javascript
     function example() {
       const x = 10;
     }
     ```

8. **`arrowParens: "avoid"`**  
   Omits parentheses around a single argument in arrow functions.

   - **Correct**:
     ```javascript
     const add = (x) => x + 1;
     ```
   - **Incorrect**:
     ```javascript
     const add = (x) => x + 1;
     ```

9. **`endOfLine: "lf"`**  
   Forces the use of `LF` (Line Feed) for line endings (Unix-style).
   - This rule ensures that all files use the LF line ending, regardless of the OS being used by the developer.

### How to Apply Formatting

Once you have cloned the repository, you can automatically format the code using Prettier. To do this, run the following command:

```bash
npm run format
```
