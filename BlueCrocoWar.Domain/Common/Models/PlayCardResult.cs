namespace BlueCrocoWar.Domain.Common.Models
{
    public class PlayCardResult
    {
        public string PlayerId { get; set; }
        public string Suit {  get; set; }
        public string Rank {  get; set; }
        public int CardsLeft { get; set; }

        public bool ClearUI { get; set; }
        
        // if null - tie
        public string? RoundWinnerId { get; set; }
        public bool GameOver { get; set; }
        public string? GameWinnerId { get; set; }
        
        public string? OpponentPlayerId { get; set; }
        public string? OpponentSuit { get; set; }
        public string? OpponentRank { get; set; }
        public int? OpponentCardsLeft { get; set; }
    }
}