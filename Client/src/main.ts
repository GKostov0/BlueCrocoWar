import * as signalR from "@microsoft/signalr";

// Create connection
const connection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7126/gameHub', {
        transport: signalR.HttpTransportType.WebSockets,
        timeout: 15000
    })
    .build();

function getOrCreateUserId(): string {
    let userId = localStorage.getItem('warGame_userId');
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem('warGame_userId', userId);
    }
    return userId;
}

// connection.onclose((error) => {
//     console.log('Connection closed', error?.message || '');
// });

// connection.onreconnecting((error) => {
//     console.log('Reconnecting...', error?.message || '');
// });

// connection.onreconnected((connectionId) => {
//     console.log('Reconnected with ID:', connectionId);
// });

try {
    await connection.start();
    console.log("Connected.");
} catch (err) {
    console.error("Connection failed: ", err);
}
await connection.invoke('RegistePlayer', getOrCreateUserId());

// const interval = setInterval(async () => {
//     if (connection.state === 'Connected') {
//         try {
//             await connection.invoke('SendMessage', `Keep alive - ${new Date().toLocaleTimeString()}`);
//             console.log('Keep-alive message sent');
//         } catch (error) {
//             console.error('Error sending keep-alive:', error);
//         }
//     }
// }, 5000);

// window.addEventListener('beforeunload', () => {
//     clearInterval(interval);
//     connection.stop();
// });