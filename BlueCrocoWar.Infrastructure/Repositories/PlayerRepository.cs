using BlueCrocoWar.Application.Common.Interfaces;
using BlueCrocoWar.Domain.Common.Models;
using System.Collections.Concurrent;

namespace BlueCrocoWar.Infrastructure.Repositories
{
    public class PlayerRepository : IPlayerRepository
    {
        private readonly ConcurrentDictionary<Guid, PlayerModel> _storage = new ConcurrentDictionary<Guid, PlayerModel>();

        public void Save(PlayerModel playerModel) => _storage[playerModel.Id] = playerModel;

        public PlayerModel GetMicrowave(Guid id)
        {
            return _storage.TryGetValue(id, out var playerModel)
                ? playerModel
                : throw new InvalidOperationException($"Player with id {id} not found");
        }
    }
}