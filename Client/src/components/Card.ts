import { Graphics, Text, Container, Color } from "pixi.js";

export interface CardConfig {
    cardWidth?: number;
    cardHeight?: number;
    position?: { x: number; y: number };
    backgroundColor?: number | string;
    textColor?: string;
    fontSize?: number;
    showText?: boolean;
    borderColor?: number;
    borderWidth?: number;
}

export class Card extends Container {
    private background: Graphics;
    private cardText: Text | null = null;
    private currentText: string = '';
    private config: CardConfig;
    private currentBgColor: number;
    private _cardWidth: number;
    private _cardHeight: number;

    constructor(config: CardConfig = {}) {
        super();
        
        this.config = {
            cardWidth: 150,
            cardHeight: 200,
            backgroundColor: 0x000000,
            textColor: '#ffffff',
            fontSize: 24,
            showText: true,
            borderColor: 0xffffff,
            borderWidth: 2,
            ...config
        };

        this._cardWidth = this.config.cardWidth!;
        this._cardHeight = this.config.cardHeight!;

        if (typeof this.config.backgroundColor === 'string') {
            this.currentBgColor = Color.shared.setValue(this.config.backgroundColor).toNumber();
        } else {
            this.currentBgColor = this.config.backgroundColor as number;
        }

        this.position.set(
            this.config.position?.x || 0,
            this.config.position?.y || 0
        );

        this.background = new Graphics();
        this.redraw();
        this.addChild(this.background);

        if (this.config.showText) {
            this.cardText = new Text({
                text: '',
                style: {
                    fill: this.config.textColor,
                    fontSize: this.config.fontSize,
                    fontFamily: 'Arial',
                    align: 'center',
                },
                anchor: 0.5,
                position: { 
                    x: this._cardWidth / 2, 
                    y: this._cardHeight / 2 
                }
            });
            this.addChild(this.cardText);
        }
    }

    private redraw(): void {
        this.background.clear();
        
        if (this.config.borderWidth && this.config.borderWidth > 0) {
            this.background.rect(0, 0, this._cardWidth, this._cardHeight);
            this.background.fill(this.config.borderColor);
            
            const innerX = this.config.borderWidth;
            const innerY = this.config.borderWidth;
            const innerWidth = this._cardWidth - (this.config.borderWidth * 2);
            const innerHeight = this._cardHeight - (this.config.borderWidth * 2);
            
            this.background.rect(innerX, innerY, innerWidth, innerHeight);
            this.background.fill(this.currentBgColor);
        } else {
            this.background.rect(0, 0, this._cardWidth, this._cardHeight);
            this.background.fill(this.currentBgColor);
        }
    }

    public setCard(rank: string, suit: string): void {
        if (this.cardText) {
            this.currentText = `${rank} ${suit}`;
            this.cardText.text = this.currentText;
        }
    }

    public clearCard(): void {
        if (this.cardText) {
            this.currentText = '';
            this.cardText.text = '';
        }
    }

    public setCardText(text: string): void {
        if (this.cardText) {
            this.currentText = text;
            this.cardText.text = text;
        }
    }

    public getCurrentText(): string {
        return this.currentText;
    }

    public setBackgroundColor(color: number | string): void {
        if (typeof color === 'string') {
            this.currentBgColor = Color.shared.setValue(color).toNumber();
        } else {
            this.currentBgColor = color;
        }
        this.redraw();
    }

    public setEnabled(enabled: boolean): void {
        this.eventMode = enabled ? 'static' : 'none';
        this.cursor = enabled ? 'pointer' : 'default';
        this.alpha = enabled ? 1 : 0.7;
    }

    public setSize(width: number, height: number): void {
        this._cardWidth = width;
        this._cardHeight = height;
        this.redraw();
        
        if (this.cardText) {
            this.cardText.position.set(width / 2, height / 2);
        }
    }

    public getCardWidth(): number {
        return this._cardWidth;
    }

    public getCardHeight(): number {
        return this._cardHeight;
    }

    public getConfig(): CardConfig {
        return { 
            ...this.config, 
            backgroundColor: this.currentBgColor,
            cardWidth: this._cardWidth,
            cardHeight: this._cardHeight
        };
    }
}