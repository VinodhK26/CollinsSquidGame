using Microsoft.AspNetCore.SignalR;

public class TaskHub : Hub
{
    private readonly DbService _db;

    public TaskHub(DbService db)
    {
        _db = db;
    }

    public async Task MarkTaskCompleted(int teamId, int taskId)
    {
        await _db.MarkTaskCompletedAsync(teamId, taskId);
        await Clients.All.SendAsync("TaskUpdated", new { teamId, taskId });
    }
}
