using BlueCrocoWar.Application.Common.Interfaces;
using BlueCrocoWar.Domain.Common.Models;
using System.Collections.Concurrent;

namespace BlueCrocoWar.Infrastructure.Repositories
{
    public class PlayerRepository : IPlayerRepository
    {
        private readonly ConcurrentDictionary<string, PlayerModel> _storage = new ConcurrentDictionary<string, PlayerModel>();

        public PlayerModel? GetPlayer(string id)
        {
            _storage.TryGetValue(id, out var result);
            return result ?? null;
        }

        public void Save(PlayerModel playerModel)
        {
            _storage[playerModel.Id] = playerModel;
        }
    }
}