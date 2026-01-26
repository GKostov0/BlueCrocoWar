import { GameScene } from "../scenes/GameScene";
import { SceneManager } from "../scenes/SceneManager";
import { PlayCardResult } from '../models/PlayCardResult';

export class GameService {
    private sceneManager: SceneManager;
    private currentGameState: GameState = GameState.None;

    constructor(sceneManager: SceneManager) {
        this.sceneManager = sceneManager;
    }

    public handlePlayerJoined(): void {

        this.sceneManager.changeScene("lobby");
        // this.sceneManager.getCurrentScene()?.onPlayerJoined?.(playerId);
        this.currentGameState = GameState.InLobby;
    }

    public handleGameStarted(gameData: any): void {
        console.log("Game started!", gameData);
        this.currentGameState = GameState.InGame;
        this.sceneManager.changeScene("game");
    }

    public onHandPlayed(gameData: PlayCardResult): void {
        const gameScene = this.sceneManager.getCurrentScene() as GameScene;
        gameScene.UpdateUI(gameData);
    }

    public handlePlayerLeft(playerId: string): void {
        console.log(`Player ${playerId} left`);
    }

    public handleGameOver(winnerId: string): void {
        console.log("Game over! Winner:", winnerId);
        this.currentGameState = GameState.GameOver;
        const gameScene = this.sceneManager.getCurrentScene() as GameScene;
        gameScene.showGameOver(winnerId);
    }

    public getCurrentState(): GameState {
        return this.currentGameState;
    }
}

export enum GameState {
    None = 0,
    InLobby = 1,
    InGame = 2,
    GameOver = 3
}