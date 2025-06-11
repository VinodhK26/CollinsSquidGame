public class TaskHub : Hub
{
    // Static in-memory state (shared across all connections)
    private static Dictionary<int, HashSet<int>> _teamProgress = new();

    public override async Task OnConnectedAsync()
    {
        // When a new client connects, send the full leaderboard state
        await Clients.Caller.SendAsync("LoadInitialState", _teamProgress);
        await base.OnConnectedAsync();
    }

    public async Task MarkTaskCompleted(int teamId, int taskId)
    {
        lock (_teamProgress)
        {
            if (!_teamProgress.ContainsKey(teamId))
                _teamProgress[teamId] = new HashSet<int>();

            _teamProgress[teamId].Add(taskId);
        }

        // Broadcast update to everyone
        await Clients.All.SendAsync("TaskUpdated", new { teamId, taskId });
    }
}
