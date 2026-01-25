import { Application, Text, Graphics } from "pixi.js";
import { BaseScene } from "./BaseScene";
import { Card } from "../components/Card";
import { PlayButton } from "../components/PlayButton";
import { SignalRService } from "../services/SignalRService";
import { PlayCardResult } from '../models/PlayCardResult';

export class GameScene extends BaseScene {

    private signalRService: SignalRService | null = null;

    private scoreText: Text | null = null;
    private cardsLeftText: Text | null = null;

    private myCard: Card | null = null;
    private opponentCard: Card | null = null;
    private playButton: PlayButton | null = null;

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
            x: this.app.screen.width / 2,
            y: 50
        }
        });

        this.cardsLeftText = new Text({
        text: 'Cards: 26',
        style: {
            fill: '#ffffff',
            fontSize: 24,
            fontFamily: 'MyFont',
            align: 'center',
        },
        anchor: 0.5,
        position: {
            x: 60,
            y: 50
        }
        });

        this.myCard = new Card({
            position: { 
                x: this.app.screen.width / 2 - 75, 
                y: 400 
            },
            cardWidth: 150,
            cardHeight: 200,
            backgroundColor: 0x000000,
            textColor: '#ffffff'
        });

        this.opponentCard = new Card({
            position: { 
                x: this.app.screen.width / 2 - 75, 
                y: 180 
            },
            cardWidth: 150,
            cardHeight: 200,
            backgroundColor: 0x000000,
            textColor: '#ffffff'
        });

        this.playButton = new PlayButton({
            position: { 
                x: this.app.screen.width / 2 - 100, 
                y: this.app.screen.height / 1.3 
            },
            buttonWidth: 200,
            buttonHeight: 100,
            text: 'Play Card'
        });

        this.playButton.onClick(() => this.cardPlayed());

        this.container.addChild(background);
        this.container.addChild(this.cardsLeftText);
        this.container.addChild(this.scoreText);

        this.container.addChild(this.myCard);
        this.container.addChild(this.opponentCard);
        this.container.addChild(this.playButton);
    }

    public setSignalRService(signalR: SignalRService): void {
        this.signalRService = signalR;
    }

    public async cardPlayed(): Promise<void>
    {
        this.playButton!.setEnabled(false);
        await this.signalRService?.OnCardPlayed();
    }

    public UpdateUI(result: PlayCardResult): void
    {
        const isMe = this.signalRService?.getOrCreateUserId() === result.playerId;
        
        if (isMe) {
            // My card
            this.myCard?.setCard(result.rank, result.suit);
            this.cardsLeftText!.text = 'Cards: ' + result.cardsLeft;
        } else {
            // Opponent's card
            this.opponentCard?.setCard(result.rank, result.suit);
        }

        if (result.clearUI)
        {
            setTimeout(() => {
                this.myCard!.clearCard();
                this.opponentCard!.clearCard();
                this.playButton!.setEnabled(true);
                console.log('clear UI');
            }, 2000);
        }
    }

    public update(delta: number): void {
        
    }

    public onPlayerJoined(playerId: string): void {
        
    }

    public onPlayerLeft(playerId: string): void {
        // Disconnected...
    }

    public destroy(): void {
        this.container.removeChildren();
    }
}