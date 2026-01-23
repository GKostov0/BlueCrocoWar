import { Application, Text, Graphics } from "pixi.js";
import { BaseScene } from "./BaseScene";

export class LobbyScene extends BaseScene {
    private waitingText: Text | null = null;
    private background: Graphics | null = null;

    constructor(app: Application) {
        super(app);
    }

    public initialize(): void {
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;

        this.background = new Graphics();
        this.background.rect(0, 0, screenWidth, screenHeight);
        this.background.fill(0x333333);
        this.container.addChild(this.background);

        this.waitingText = new Text({
            text: 'Waiting for another player to join...',
            style: {
                fill: '#da1010',
                fontSize: 36,
                fontFamily: 'Arial',
                align: 'center',
            }
        });
        this.waitingText.anchor.set(0.5);
        this.waitingText.x = screenWidth / 2;
        this.waitingText.y = screenHeight / 2;
        this.container.addChild(this.waitingText);
    }

    public update(delta: number): void {
        
    }

    public onPlayerJoined(playerId: string): void {
        // Start game
    }

    public onPlayerLeft(playerId: string): void {
        // Handle disconnected
    }

    public destroy(): void {
        this.container.removeChildren();
    }
}