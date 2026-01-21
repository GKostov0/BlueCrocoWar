// This is TypeScript code
const message: string = "Hello from TypeScript!";
console.log(message);

// Update the webpage with our message
const appElement = document.getElementById('app');
if (appElement) {
    appElement.innerHTML = `
        <h2>${message}</h2>
        <p>The page opened successfully!</p>
        <p>Check the browser console (F12) to see the TypeScript message.</p>
    `;
}