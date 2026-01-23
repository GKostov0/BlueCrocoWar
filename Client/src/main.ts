import { PixiGame } from "./game/PixiGame";
import { GameService } from "./services/GameService";
import { SignalRService } from "./services/SignalRService";

class GameApp {
    private pixiGame: PixiGame;
    private gameService: GameService;
    private signalRService: SignalRService;

    constructor() {
        const gameContainer = document.getElementById('game-container')!;
        this.pixiGame = new PixiGame(gameContainer);

        this.gameService = new GameService(this.pixiGame.getSceneManager());
        this.signalRService = new SignalRService(this.gameService);

        this.initialize();
    }

    private async initialize(): Promise<void> {
        try {
            await this.signalRService.connect();
        } catch (error) {
            console.error("Failed to initialize game:", error);
        }
    }

    public cleanup(): void {
        this.signalRService.disconnect();
        this.pixiGame.cleanup();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gameApp = new GameApp();
    
    window.addEventListener('beforeunload', () => {
        gameApp.cleanup();
    });
});