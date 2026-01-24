using BlueCrocoWar.Domain.Common.Enums;

namespace BlueCrocoWar.Domain.Common.Models
{
    public class Card(CardSuit suit, CardRank rank)
    {
        public CardRank Rank { get; set; } = rank;
        public CardSuit Suit { get; set; } = suit;
    }
}