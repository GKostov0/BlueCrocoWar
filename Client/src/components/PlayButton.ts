import { Graphics, Text, Container } from "pixi.js";

export interface PlayButtonConfig {
    buttonWidth?: number;
    buttonHeight?: number;
    position?: { x: number; y: number };
    backgroundColor?: string;
    text?: string;
}

export class PlayButton extends Container {
    private background: Graphics;
    private buttonText: Text;
    private _buttonWidth: number;
    private _buttonHeight: number;
    private clickCallback: (() => void) | null = null;

    constructor(config: PlayButtonConfig = {}) {
        super();
        
        this._buttonWidth = config.buttonWidth || 200;
        this._buttonHeight = config.buttonHeight || 100;
        const x = config.position?.x || 0;
        const y = config.position?.y || 0;

        this.position.set(x, y);

        this.background = new Graphics();
        this.drawBackground(config.backgroundColor || '#ffffff');
        this.addChild(this.background);

        this.buttonText = new Text({
            text: config.text || 'Play Card',
            style: {
                fontFamily: 'Arial',
                fontSize: 24,
                fill: '#000000',
                align: 'center'
            },
            anchor: 0.5,
            position: { x: this._buttonWidth / 2, y: this._buttonHeight / 2 }
        });

        this.buttonText.eventMode = 'none';
        this.buttonText.hitArea = null;

        this.addChild(this.buttonText);
    }

    private drawBackground(color: string): void {
        this.background.clear();
        this.background.rect(0, 0, this._buttonWidth, this._buttonHeight);
        this.background.fill(color);
    }

    public setEnabled(enabled: boolean): void {
        this.eventMode = enabled ? 'static' : 'none';
        this.cursor = enabled ? 'pointer' : 'default';
        this.background.alpha = enabled ? 1 : 0.5;
    }

    public setText(text: string): void {
        this.buttonText.text = text;
    }

    public onClick(callback: () => void): void {
        this.clickCallback = callback;
        this.background.eventMode = 'static';
        
        this.background.on('pointerdown', () => {
            this.background.alpha = 0.8;
            
            if (this.clickCallback) {
                this.clickCallback();
            }
            
            setTimeout(() => {
                this.background.alpha = 1;
            }, 150);
        });
        
        this.background.cursor = 'pointer';
    }

    public removeListeners(): void {
        this.background.off('pointerdown');
        this.clickCallback = null;
    }

    public getButtonWidth(): number {
        return this._buttonWidth;
    }

    public getButtonHeight(): number {
        return this._buttonHeight;
    }
}