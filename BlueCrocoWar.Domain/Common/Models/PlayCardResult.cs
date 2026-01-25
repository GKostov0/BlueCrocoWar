namespace BlueCrocoWar.Domain.Common.Models
{
    public class PlayCardResult
    {
        public string PlayerId { get; set; }
        public string Suit {  get; set; }
        public string Rank {  get; set; }
        public int CardsLeft { get; set; }
        public int OtherCardsLeft { get; set; }

        public bool ClearUI { get; set; }
    }
}