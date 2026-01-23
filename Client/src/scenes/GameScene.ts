import { Application, Text, Graphics, Sprite } from "pixi.js";
import { BaseScene } from "./BaseScene";

export class GameScene extends BaseScene {

    private scoreText: Text | null = null;

    constructor(app: Application) {
        super(app);   
    }

    public initialize(): void {
        const background = new Graphics();
        background.rect(0, 0, this.app.screen.width, this.app.screen.height);
        background.fill(0x222222);

        this.scoreText = new Text({
        text: 'Score: 0-0',
        style: {
            fill: '#ffffff',
            fontSize: 24,
            fontFamily: 'MyFont',
            align: 'center',
        },
        anchor: 0.5,
        position: {
            x: 220,
            y: 220
        }
        });

        this.container.addChild(background);
        this.container.addChild(this.scoreText);
    }

    public update(delta: number): void {
    }

    public destroy(): void {
        this.container.removeChildren();
    }
}