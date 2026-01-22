import { HubConnectionBuilder } from '@microsoft/signalr';

// Create connection
const connection = new HubConnectionBuilder()
    .withUrl('https://localhost:7126/gameHub')
    .build();

// Handle incoming messages
connection.on('ReceiveMessage', (message: string) => {
    console.log('📥 Server says:', message);
});

// Connection events
connection.onclose((error) => {
    console.log('❌ Connection closed', error?.message || '');
});

connection.onreconnecting((error) => {
    console.log('🔄 Reconnecting...', error?.message || '');
});

connection.onreconnected((connectionId) => {
    console.log('✅ Reconnected with ID:', connectionId);
});

// Start connection
console.log('Connecting...');
await connection.start();
await connection.invoke('SendMessage', 'Hello from frontend');

// Keep sending messages every 5 seconds
const interval = setInterval(async () => {
    if (connection.state === 'Connected') {
        try {
            await connection.invoke('SendMessage', `Keep alive - ${new Date().toLocaleTimeString()}`);
            console.log('📤 Keep-alive message sent');
        } catch (error) {
            console.error('Error sending keep-alive:', error);
        }
    }
}, 5000);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    clearInterval(interval);
    connection.stop();
});
      