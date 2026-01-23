import * as signalR from "@microsoft/signalr";
import { GameService } from "./GameService";

export class SignalRService {
    private connection: signalR.HubConnection;
    private gameService: GameService;

    constructor(gameService: GameService) {
        this.gameService = gameService;
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7126/gameHub', {
                transport: signalR.HttpTransportType.WebSockets,
                timeout: 15000
            })
            .build();

        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        this.connection.on("PlayerJoinedLobby", (playerId: string) => {
            this.gameService.handlePlayerJoined(playerId);
        });

        this.connection.on("GameStarted", (gameData: any) => {
            this.gameService.handleGameStarted(gameData);
        });

        this.connection.on("PlayerLeft", (playerId: string) => {
            this.gameService.handlePlayerLeft(playerId);
        });
    }

    public async connect(): Promise<void> {
        try {
            await this.connection.start();
            console.log("SignalR Connected.");
            
            const userId = this.getOrCreateUserId();
            await this.connection.invoke('RegisterPlayer', userId, this.connection.connectionId);
            
        } catch (err) {
            console.error("Connection failed: ", err);
            throw err;
        }
    }

    private getOrCreateUserId(): string {
        let userId = localStorage.getItem('warGame_userId');
        if (!userId) {
            userId = crypto.randomUUID();
            localStorage.setItem('warGame_userId', userId);
        }
        return userId;
    }

    public getConnection(): signalR.HubConnection {
        return this.connection;
    }

    public async disconnect(): Promise<void> {
        await this.connection.stop();
    }
}