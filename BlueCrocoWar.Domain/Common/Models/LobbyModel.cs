namespace BlueCrocoWar.Domain.Common.Models
{
    public class LobbyModel
    {
        public LobbyModel(Guid id)
        {
            Id = id;
        }

        public Guid Id { get; set; }

        public PlayerModel? PlayerOne { get; set; }
        public PlayerModel? PlayerTwo { get; set; }

        public bool GameStarted { get; set; }
    }
}