using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Crocodile.Hubs
{
    public class CanvasHub : Hub
    {
        public async Task SendLines(string gameId, Object array, Object settings)
        {
            await Clients.Group(gameId).SendAsync("ReceiveMessage", array, settings);
        }
        public async Task Clear(string gameId)
        {
            await Clients.Group(gameId).SendAsync("ReceiveClear");
        }
        public async Task EnterGame(string gameId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
        }
    }
}           
   
       
         
          
            
            