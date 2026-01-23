import { Application } from "pixi.js";
import { SceneManager } from "../scenes/SceneManager";
import { LobbyScene } from "../scenes/LobbyScene";
import { GameScene } from "../scenes/GameScene";

export class PixiGame {
    private app: Application;
    private sceneManager: SceneManager;

    constructor(container: HTMLElement) {

        this.app = new Application();

        this.initializeApp(container);

        this.sceneManager = new SceneManager(this.app);

        this.sceneManager.registerScene("lobby", new LobbyScene(this.app));
        this.sceneManager.registerScene("game", new GameScene(this.app));

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

    public getSceneManager(): SceneManager {
        return this.sceneManager;
    }

    public cleanup(): void {
        this.app.destroy(true, true);
    }
}