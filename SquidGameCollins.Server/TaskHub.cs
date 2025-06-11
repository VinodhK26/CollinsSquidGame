using Microsoft.AspNetCore.SignalR;

public class TaskHub : Hub
{
    private readonly DbService _db;

    public TaskHub(DbService db)
    {
        _db = db;
    }

    public override async Task OnConnectedAsync()
    {
        var data = await _db.GetLeaderboardStateAsync();
        await Clients.Caller.SendAsync("LoadInitialState", data);
        await base.OnConnectedAsync();
    }

    public async Task MarkTaskCompleted(int teamId, int taskId)
    {
        await _db.MarkTaskCompletedAsync(teamId, taskId);
        await Clients.All.SendAsync("TaskUpdated", new { teamId, taskId });
    }
}
