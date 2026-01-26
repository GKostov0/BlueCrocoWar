using BlueCrocoWar.Application.Common.Interfaces;
using BlueCrocoWar.Domain.Common.Models;
using System.Collections.Concurrent;

namespace BlueCrocoWar.Infrastructure.Repositories
{
    public class GameRepository : IGameRepository
    {
        private readonly ConcurrentDictionary<string, PlayerModel> _playerStorage = new ConcurrentDictionary<string, PlayerModel>();
        private readonly ConcurrentDictionary<Guid, LobbyModel> _lobbyStorage = new ConcurrentDictionary<Guid, LobbyModel>();

        public LobbyModel? GetLobby(Guid id)
        {
            _lobbyStorage.TryGetValue(id, out var result);
            return result ?? null;
        }

        public PlayerModel? GetPlayer(string id)
        {
            _playerStorage.TryGetValue(id, out var result);
            return result ?? null;
        }

        public PlayerModel? GetPlayerByConnectionId(string connectionId)
        {
            return _playerStorage.Values.FirstOrDefault(p => p.ConnectionId == connectionId);
        }

        public void SaveLobby(LobbyModel lobbyModel)
        {
            _lobbyStorage[lobbyModel.Id] = lobbyModel;
        }

        public void SavePlayer(PlayerModel playerModel)
        {
            _playerStorage[playerModel.UserId] = playerModel;
        }

        public LobbyModel? GetFreeLobby()
        {
            return _lobbyStorage.FirstOrDefault(x => x.Value.PlayerTwo == null).Value;
        }
    }
}