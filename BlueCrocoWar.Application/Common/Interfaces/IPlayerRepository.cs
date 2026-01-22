using BlueCrocoWar.Domain.Common.Models;

namespace BlueCrocoWar.Application.Common.Interfaces
{
    public interface IPlayerRepository
    {
        PlayerModel GetMicrowave(Guid id);
        void Save(PlayerModel playerModel);
    }
}