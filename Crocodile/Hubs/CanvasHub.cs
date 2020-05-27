using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Crocodile.Hubs
{
    public class CanvasHub : Hub
    {
        public async Task SendMessage(Object array)
        {
            await Clients.All.SendAsync("ReceiveMessage", array);
        }
    }
}