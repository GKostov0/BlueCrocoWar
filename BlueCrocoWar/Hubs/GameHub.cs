using Microsoft.AspNetCore.SignalR;

namespace BlueCrocoWar.Hubs;

public class GameHub : Hub
{
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

    public async Task SendMessage(string message)
    {
        Console.WriteLine($"Received from {Context.ConnectionId}: {message}");
        await Clients.All.SendAsync("ReceiveMessage", $"Server echoes: {message}");
    }
}