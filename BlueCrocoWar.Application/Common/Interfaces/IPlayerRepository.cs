using BlueCrocoWar.Domain.Common.Models;

namespace BlueCrocoWar.Application.Common.Interfaces
{
    public interface IPlayerRepository
    {
        PlayerModel? GetPlayer(string id);
        void Save(PlayerModel playerModel);
    }
}