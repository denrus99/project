using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Crocodile.Hubs
{
    public class CanvasHub : Hub
    {
        public async Task SendMessage(string user, string text, string date)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, text, date);
        }
    }
}