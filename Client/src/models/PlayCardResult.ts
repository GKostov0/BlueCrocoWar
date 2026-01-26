export interface PlayCardResult {
    playerId: string;
    suit: string;
    rank: string;
    cardsLeft: number;
    clearUI: boolean;
    roundWinnerId?: string | null;
    gameOver: boolean;
    gameWinnerId?: string | null;
    opponentPlayerId?: string | null;
    opponentSuit?: string | null;
    opponentRank?: string | null;
    opponentCardsLeft?: number | null;
}