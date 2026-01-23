import { Application } from "pixi.js";
import { BaseScene } from "./BaseScene";

export class SceneManager {
    private app: Application;
    private scenes: Map<string, BaseScene> = new Map();
    private currentScene?: BaseScene;

    constructor(app: Application) {
        this.app = app;
    }

    public registerScene(name: string, scene: BaseScene): void {
        this.scenes.set(name, scene);
    }

    public changeScene(name: string): void {
        const newScene = this.scenes.get(name);
        if (!newScene) {
            console.error(`Scene ${name} not found!`);
            return;
        }

        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene.getContainer());
            this.currentScene.destroy();
        }

        this.currentScene = newScene;
        this.app.stage.addChild(this.currentScene.getContainer());
        this.currentScene.initialize();
    }

    public getCurrentScene(): BaseScene | undefined {
        return this.currentScene;
    }

    public update(delta: number): void {
        this.currentScene?.update(delta);
    }
}