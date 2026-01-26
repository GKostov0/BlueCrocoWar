using BlueCrocoWar.Domain.Common.Models;

namespace BlueCrocoWar.Application.Common.Interfaces
{
    public interface IGameRepository
    {
        LobbyModel? GetLobby(Guid id);
        PlayerModel? GetPlayer(string id);
        PlayerModel? GetPlayerByConnectionId(string connectionId);

        void SavePlayer(PlayerModel playerModel);
        void SaveLobby(LobbyModel lobbyModel);

        public LobbyModel? GetFreeLobby();
    }
}