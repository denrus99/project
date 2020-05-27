using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Crocodile.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string text, string date)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, text, date);
        }
    }
}