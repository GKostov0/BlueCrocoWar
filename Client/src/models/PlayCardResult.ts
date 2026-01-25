export interface PlayCardResult {
    playerId: string;
    suit: string;
    rank: string;
    cardsLeft: number;
    otherCardsLeft: number;
    clearUI: boolean;
}