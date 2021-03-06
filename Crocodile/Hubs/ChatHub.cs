using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Crocodile.Hubs
{
    public class ChatHub : Hub
    {
        public static Dictionary<string, int> dic = new Dictionary<string, int>();
        public async Task SendMessage(string gameId, string user, string text, string date, string photo)
        {
            if (!dic.ContainsKey(gameId))
            {
                dic.Add(gameId, 0);
            }
            await Clients.Group(gameId).SendAsync("ReceiveMessage", dic[gameId]++, user, text, date,photo);
        }
        public async Task EnterChat(string gameId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
        }
        
        public async Task SendReaction(string gameId, int grade, int id, string master = null)
        {
            await Clients.Group(gameId).SendAsync("ReceiveReaction", grade, id, master);
        }
        
        
    }
}