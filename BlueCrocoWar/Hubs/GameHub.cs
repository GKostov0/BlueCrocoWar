using BlueCrocoWar.Application.Common.Interfaces;
using BlueCrocoWar.Domain.Common.Models;
using BlueCrocoWar.Domain.Services;
using Microsoft.AspNetCore.SignalR;

namespace BlueCrocoWar.Hubs;

public class GameHub : Hub
{
    private IGameRepository _gameRepository;

    public GameHub(IGameRepository playerRepository)
    {
        _gameRepository = playerRepository;
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
    public async void RegisterPlayer(string playerId, string connectionID)
    {
        Console.WriteLine($"Registering new player with ID: [{playerId}]");

        PlayerModel? playerResult = _gameRepository.GetPlayer(playerId);

        if (playerResult == null)
        {
            playerResult = new PlayerModel { UserId = playerId, ConnectionId = connectionID };
            _gameRepository.SavePlayer(playerResult);
            Console.WriteLine($"Player [{playerId}] registered successfuly!");
        }
        else
        {
            Console.WriteLine($"Player [{playerId}] already registered.");
        }

        await AddPlayerToLobby(playerResult);
    }

    private LobbyModel CreateLobby()
    {
        Console.WriteLine($"Creating a new Lobby...");

        LobbyModel result = new LobbyModel(Guid.NewGuid());

        _gameRepository.SaveLobby(result);
        Console.WriteLine($"Lobby [{result.Id}] created successfuly!");

        return result;
    }

    private async Task<LobbyModel> JoinOrCreateLobby(PlayerModel player)
    {
        Console.WriteLine("Connecting to lobby...");
        LobbyModel? result = _gameRepository.GetFreeLobby();

        if (result != null)
        {
            Console.WriteLine($"Connected to lobby [{result.Id}]");
            result.PlayerTwo = player;

            result.Dealer = new GameDealer();
            result.Dealer.ShuffleCards();
            result.Dealer.DealToPlayers(result.PlayerOne, result.PlayerTwo);

            await Clients.Client(result.PlayerOne.ConnectionId).SendAsync("GameStarted");
            await Clients.Client(result.PlayerTwo.ConnectionId).SendAsync("GameStarted");

            result.GameStarted = true;
        }
        else
        {
            Console.WriteLine("No free lobby found...");
            result = CreateLobby();
            result.PlayerOne = player;
            await Clients.Client(player.ConnectionId).SendAsync("PlayerJoinedLobby");
        }

        return result;
    }

    private async Task AddPlayerToLobby(PlayerModel player)
    {
        Console.WriteLine($"Finding a lobby for player [{player.UserId}]");
        player.Lobby ??= await JoinOrCreateLobby(player);
    }

    public async void PlayerCardPlayed(string playerID)
    {
        PlayerModel? player = _gameRepository.GetPlayer(playerID);

        if (player != null)
        {
            LobbyModel? lobby = player.Lobby;

            if (lobby != null)
            {
                PlayCardResult? result = lobby.Dealer.PlayCard(player);
                if (result != null)
                {
                    await Clients.Client(lobby.PlayerOne.ConnectionId).SendAsync("OnHandPlayed", result);
                    await Clients.Client(lobby.PlayerTwo.ConnectionId).SendAsync("OnHandPlayed", result);
                }
            }
        }
    }
}