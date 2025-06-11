using Microsoft.AspNetCore.SignalR;

public class TaskHub : Hub
{
    public async Task MarkTaskCompleted(int teamId, int taskId)
    {
        await Clients.All.SendAsync("TaskUpdated", new { teamId, taskId });
    }
}