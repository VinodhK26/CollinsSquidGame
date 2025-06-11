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

    public async Task RequestStateRefresh()
    {
        var data = await _db.GetLeaderboardStateAsync();
        await Clients.All.SendAsync("LoadInitialState", data);
    }

    public async Task MarkTaskCompleted(int teamId, int taskId)
    {
        try
        {
            await _db.MarkTaskCompletedAsync(teamId, taskId);
            await Clients.All.SendAsync("TaskUpdated", new { teamId, taskId });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[MarkTaskCompleted ERROR] {ex.Message}");
            throw; // rethrow so client still receives error
        }
    }

    public async Task CreateTeam(string teamName)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(teamName))
                return;

            await _db.CreateTeamAsync(teamName);

            var data = await _db.GetLeaderboardStateAsync();
            await Clients.All.SendAsync("LoadInitialState", data);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[CreateTeam ERROR] {ex.Message}");
            throw;
        }
    }
}
