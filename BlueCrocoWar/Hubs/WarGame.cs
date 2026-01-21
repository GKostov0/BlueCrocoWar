using Microsoft.AspNetCore.SignalR;

namespace BlueCrocoWar.Hubs;

public sealed class WarGame : Hub
{
    public async Task NewMessage(long username, string message) =>
        await Clients.All.SendAsync("messageReceived", username, message);
}