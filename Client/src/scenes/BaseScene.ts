import { Application, Container } from "pixi.js";

export abstract class BaseScene {
    protected app: Application;
    protected container: Container;
    
    constructor(app: Application) {
        this.app = app;
        this.container = new Container();
    }

    public abstract initialize(): void;
    public abstract update(delta: number): void;
    public abstract destroy(): void;

    public getContainer(): Container {
        return this.container;
    }

    public onPlayerJoined?(playerId: string): void;
    public onPlayerLeft?(playerId: string): void;
    public onGameStarted?(gameData: any): void;
}