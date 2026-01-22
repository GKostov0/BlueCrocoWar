using BlueCrocoWar.Application.Common.Interfaces;
using BlueCrocoWar.Domain.Common.Models;
using Microsoft.AspNetCore.SignalR;

namespace BlueCrocoWar.Hubs;

public class GameHub : Hub
{
    private IPlayerRepository _playerRepository;

    public GameHub(IPlayerRepository playerRepository)
    {
        _playerRepository = playerRepository;
    }

    // This is called when a client connects
    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"Client connected: {Context.ConnectionId}");
        await base.OnConnectedAsync();
    }

    // This is called when a client disconnects
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
        await base.OnDisconnectedAsync(exception);
    }

    // NOT the signalR ConnectionId
    public async Task RegistePlayer(string playerId)
    {
        Console.WriteLine($"Registering new player with ID: [{playerId}]");

        PlayerModel? result = _playerRepository.GetPlayer(playerId);

        if (result == null)
        {
            _playerRepository.Save(new PlayerModel { Id = playerId });
            Console.WriteLine($"Player [{playerId}] registered successfuly!");
        }
        else
        {
            Console.WriteLine($"Player [{playerId}] already registered.");
        }
    }
}