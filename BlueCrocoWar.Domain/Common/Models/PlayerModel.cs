namespace BlueCrocoWar.Domain.Common.Models
{
    public class PlayerModel
    {
        public string UserId { get; set; }
        public string ConnectionId { get; set; }

        public LobbyModel? Lobby { get; set; }
    }
}