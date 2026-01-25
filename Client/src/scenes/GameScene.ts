import { Application, Text, Graphics, Container } from "pixi.js";
import { BaseScene } from "./BaseScene";
import { SignalRService } from "../services/SignalRService";
import { PlayCardResult } from '../models/PlayCardResult';

export class GameScene extends BaseScene {

    private signalRService: SignalRService | null = null;

    private scoreText: Text | null = null;
    private cardsLeftText: Text | null = null;
    private playButtonText: Text | null = null;

    private myCardText: Text | null = null;
    private opponentCardText: Text | null = null;

    private playContainer: Container | null = null;
    private playButton: Graphics | null = null;

    private myCard: Graphics | null = null;
    private opponentCard: Graphics | null = null;

    constructor(app: Application) {
        super(app);   
    }

    public initialize(): void {
        const background = new Graphics();
        background.rect(0, 0, this.app.screen.width, this.app.screen.height);
        background.fill(0x222222);

        this.playContainer = new Container();
        this.playContainer.position.x = this.app.screen.width / 2 - 100;
        this.playContainer.position.y = this.app.screen.height / 1.3;

        this.playButton = new Graphics();
        this.playButton.rect(0, 0, 200, 100);
        this.playButton.fill('#ffffff');
        this.playButton.eventMode = 'static';
        this.playButton.on('mousedown', () => this.cardPlayed());
        this.playButton.cursor = 'pointer';

        this.myCard = new Graphics();
        this.myCard.rect(this.app.screen.width / 2 - 75, 450, 150, 200);
        this.myCard.fill(0x000000);

        this.opponentCard = new Graphics();
        this.opponentCard.rect(this.app.screen.width / 2 - 75, 130, 150, 200);
        this.opponentCard.fill(0x000000);

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

        this.myCardText = new Text({
        text: '',
        style: {
            fill: '#ffffff',
            fontSize: 24,
            fontFamily: 'MyFont',
            align: 'center',
        },
        anchor: 0.5,
        position: {
            x: this.app.screen.width / 2,
            y: 500
        }
        });

        this.opponentCardText = new Text({
        text: '',
        style: {
            fill: '#ffffff',
            fontSize: 24,
            fontFamily: 'MyFont',
            align: 'center',
        },
        anchor: 0.5,
        position: {
            x: this.app.screen.width / 2,
            y: 180
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

        this.playButtonText = new Text({
        text: 'Play Card',
        style: {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: '#000000',
            align: 'center'
        },
        anchor: 0.5,
        position: {
            x: 100,
            y: 50
        }
    });
        this.container.addChild(background);
        this.container.addChild(this.myCard);
        this.container.addChild(this.opponentCard);
        this.container.addChild(this.cardsLeftText);
        this.container.addChild(this.scoreText);

        this.container.addChild(this.myCardText);
        this.container.addChild(this.opponentCardText);

        this.playContainer.addChild(this.playButton);
        this.playContainer.addChild(this.playButtonText);

        this.container.addChild(this.playContainer);
    }

    public setSignalRService(signalR: SignalRService): void {
        this.signalRService = signalR;
    }

    public async cardPlayed(): Promise<void>
    {
        this.playButton!.eventMode = 'none';
        this.playButton!.cursor = 'default';
        await this.signalRService?.OnCardPlayed();
    }

    public UpdateUI(result: PlayCardResult): void
    {
        if (this.signalRService?.getOrCreateUserId() === result.playerId)
        {
            this.myCardText!.text = result.rank + ' ' + result.suit;
            this.cardsLeftText!.text = 'Cards: ' + result.cardsLeft;
        }
        else {
            this.opponentCardText!.text = result.rank + ' ' + result.suit;
        }

        if (result.clearUI)
        {
            setTimeout(() => {
                this.myCardText!.text = '';
                this.opponentCardText!.text = '';

                this.playButton!.eventMode = 'static';
                this.playButton!.cursor = 'pointer';
            }, 1000);
        }
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