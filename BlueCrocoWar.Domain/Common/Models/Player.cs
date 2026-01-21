namespace BlueCrocoWar.Domain.Common.Models
{
    public class Player
    {
        public string ConnectionId { get; set; }
        public string Name { get; set; }
        public int PlayerNumber { get; set; }
        public Queue<Card> Deck { get; set; }
        public Card CurrentCard { get; set; }
        public int TimeBank { get; set; }
        public bool IsConnected { get; set; }
    }
}
