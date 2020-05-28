using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Crocodile.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string gameId, string user, string text, string date)
        {
            await Clients.Group(gameId).SendAsync("ReceiveMessage", user, text, date);
        }
        public async Task EnterChat(string gameId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
        }
    }
}