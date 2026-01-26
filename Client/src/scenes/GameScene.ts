import { Application, Text, Graphics } from "pixi.js";
import { BaseScene } from "./BaseScene";
import { Card } from "../components/Card";
import { PlayButton } from "../components/PlayButton";
import { SignalRService } from "../services/SignalRService";
import { PlayCardResult } from '../models/PlayCardResult';

export class GameScene extends BaseScene {

    private signalRService: SignalRService | null = null;

    private scoreText: Text | null = null;
    private myCardsLeftText: Text | null = null;
    private opponentCardsLeftText: Text | null = null;
    private roundResultText: Text | null = null;
    private gameOverText: Text | null = null;

    private myCard: Card | null = null;
    private opponentCard: Card | null = null;
    private playButton: PlayButton | null = null;
    
    private myCardCount: number = 26;
    private opponentCardCount: number = 26;
    private myPlayerId: string = '';

    constructor(app: Application) {
        super(app);
    }

    public initialize(): void {
        const background = new Graphics();
        background.rect(0, 0, this.app.screen.width, this.app.screen.height);
        background.fill(0x222222);

        this.myCardsLeftText = new Text({
            text: 'Your Cards: 26',
            style: {
                fill: '#ffffff',
                fontSize: 20,
                fontFamily: 'Arial',
                align: 'left',
            },
            anchor: { x: 0, y: 0.5 },
            position: {
                x: 20,
                y: 50
            }
        });

        this.opponentCardsLeftText = new Text({
            text: 'Opponent Cards: 26',
            style: {
                fill: '#ffffff',
                fontSize: 20,
                fontFamily: 'Arial',
                align: 'left',
            },
            anchor: { x: 0, y: 0.5 },
            position: {
                x: 20,
                y: 80
            }
        });

        this.roundResultText = new Text({
            text: '',
            style: {
                fill: '#ffff00',
                fontSize: 28,
                fontFamily: 'Arial',
                align: 'center',
            },
            anchor: 0.5,
            position: {
                x: this.app.screen.width / 2,
                y: 300
            },
            visible: false
        });

        this.gameOverText = new Text({
            text: '',
            style: {
                fill: '#00ff00',
                fontSize: 48,
                fontFamily: 'Arial',
                align: 'center',
                fontWeight: 'bold'
            },
            anchor: 0.5,
            position: {
                x: this.app.screen.width / 2,
                y: this.app.screen.height / 2
            },
            visible: false
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
        this.container.addChild(this.myCardsLeftText);
        this.container.addChild(this.opponentCardsLeftText);
        this.container.addChild(this.myCard);
        this.container.addChild(this.opponentCard);
        this.container.addChild(this.playButton);
        
        this.container.addChild(this.roundResultText);
        this.container.addChild(this.gameOverText);
    }

    public setSignalRService(signalR: SignalRService): void {
        this.signalRService = signalR;
        this.myPlayerId = signalR.getOrCreateUserId();
    }

    public async cardPlayed(): Promise<void>
    {
        this.playButton!.setEnabled(false);
        await this.signalRService?.OnCardPlayed();
    }

    public UpdateUI(result: PlayCardResult): void
    {
        const isMe = this.myPlayerId === result.playerId;
        
        if (isMe) {
            // My card
            this.myCard?.setCard(result.rank, result.suit);
            this.myCardCount = result.cardsLeft;
            this.myCardsLeftText!.text = 'Your Cards: ' + this.myCardCount;
        } else {
            // Opponent's card
            this.opponentCard?.setCard(result.rank, result.suit);
            this.opponentCardCount = result.cardsLeft;
            this.opponentCardsLeftText!.text = 'Opponent Cards: ' + this.opponentCardCount;
        }

        if (result.clearUI && result.opponentRank && result.opponentSuit) {
            if (isMe) {
                this.opponentCard?.setCard(result.opponentRank, result.opponentSuit);
                if (result.opponentCardsLeft !== null && result.opponentCardsLeft !== undefined) {
                    this.opponentCardCount = result.opponentCardsLeft;
                    this.opponentCardsLeftText!.text = 'Opponent Cards: ' + this.opponentCardCount;
                }
            } else {
                this.myCard?.setCard(result.opponentRank, result.opponentSuit);
                if (result.opponentCardsLeft !== null && result.opponentCardsLeft !== undefined) {
                    this.myCardCount = result.opponentCardsLeft;
                    this.myCardsLeftText!.text = 'Your Cards: ' + this.myCardCount;
                }
            }
        }

        if (result.clearUI)
        {
            if (result.roundWinnerId) {
                const isMyWin = result.roundWinnerId === this.myPlayerId;
                this.roundResultText!.text = isMyWin ? 'You take this hand' : 'Opponent takes this hand';
                this.roundResultText!.style.fill = isMyWin ? '#00ff00' : '#ff0000';
                this.roundResultText!.visible = true;
            } else {
                this.roundResultText!.text = 'Tie';
                this.roundResultText!.style.fill = '#ffff00';
                this.roundResultText!.visible = true;
            }

            setTimeout(() => {
                this.myCard!.clearCard();
                this.opponentCard!.clearCard();
                this.roundResultText!.visible = false;
                this.playButton!.setEnabled(true);
            }, 2000);
        }
    }

    public showGameOver(winnerId: string): void {
        const isMyWin = winnerId === this.myPlayerId;
        this.gameOverText!.text = isMyWin ? 'You Win!' : 'You Lost!';
        this.gameOverText!.style.fill = isMyWin ? '#00ff00' : '#ff0000';
        this.gameOverText!.visible = true;
        this.playButton!.setEnabled(false);
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