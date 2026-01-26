# BlueCrocoWar
War card game

Real-time multiplayer card game "War" built with .NET 8 backend and TypeScript frontend using SignalR.

# Game Rules

- **Standard 52-card deck**, split equally between two players (26 cards each)
- Players simultaneously reveal their top cards
- **Higher card wins both cards** (Ace is highest, 2 is lowest)
- **On a tie**: Skip the round - both cards go to the bottom of their respective decks
- Game continues until one player has all 52 cards or their timebanks expire

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory.
2. Build the project.
3. Run the backend server.

### Frontend Setup
1. Navigate to the client directory.
2. Install dependencies - "npm install"
3. Start - "npm run dev"

Game settings can be configured in `BlueCrocoWar/appsettings.json`:

```json
{
  "GameSettings": {
    "MaxRounds": 0,             // Maximum rounds (0 = unlimited)
    "CardRevealDelayMs": 2000,  // Delay before clearing cards after reveal (milliseconds)
    "TimebankSeconds": 300      // Timebank per player in seconds
  }
}