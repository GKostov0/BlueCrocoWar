import { Application } from "pixi.js";
import { SignalRService } from "../services/SignalRService";
import { SceneManager } from "../scenes/SceneManager";
import { LobbyScene } from "../scenes/LobbyScene";
import { GameScene } from "../scenes/GameScene";

export class PixiGame {
    private app: Application;
    private sceneManager: SceneManager;
    private gameScene: GameScene;

    constructor(container: HTMLElement) {

        this.app = new Application();

        (globalThis as any).__PIXI_APP__ = this.app;

        this.initializeApp(container);

        this.sceneManager = new SceneManager(this.app);

        this.gameScene = new GameScene(this.app);

        this.sceneManager.registerScene("lobby", new LobbyScene(this.app));
        this.sceneManager.registerScene("game", this.gameScene);

        // this.app.ticker.add((delta) => {
        //     // this.sceneManager.update(delta);
        // });

        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        });
    }

    private async initializeApp(container: HTMLElement): Promise<void> {
        // Initialize the application
        await this.app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x1099bb,
            resizeTo: window,
            antialias: true,
            autoDensity: true,
            resolution: window.devicePixelRatio || 1
        });

        container.appendChild(this.app.canvas);
    }

      public setSignalRService(signalRService: SignalRService): void {
        this.gameScene.setSignalRService(signalRService);
    }

    public getSceneManager(): SceneManager {
        return this.sceneManager;
    }

    public cleanup(): void {
        this.app.destroy(true, true);
    }
}