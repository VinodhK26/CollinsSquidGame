using Npgsql;
using Microsoft.Extensions.Configuration;
using Dapper;
public class DbService
{
    private readonly string _connectionString;

    public DbService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("PostgresDb");
    }

    public async Task<Dictionary<string, object>> GetLeaderboardStateAsync()
    {
        using var conn = new NpgsqlConnection(_connectionString);
        var sql = "SELECT teamid, teamname, istask1completed, istask2completed, istask3completed, istask4completed FROM leaderboard";
        var rows = await conn.QueryAsync(sql);

        var result = new Dictionary<string, object>();

        foreach (var row in rows)
        {
            result[row.teamid.ToString()] = new
            {
                teamName = row.teamname,
                task1 = row.istask1completed,
                task2 = row.istask2completed,
                task3 = row.istask3completed,
                task4 = row.istask4completed
            };
        }

        return result;
    }



    public async Task<List<string>> GetTeamNamesAsync()
    {
        using var conn = new NpgsqlConnection(_connectionString);
        var result = await conn.QueryAsync<string>("SELECT teamname FROM leaderboard");
        return result.ToList();
    }

    public async Task MarkTaskCompletedAsync(int teamId, int taskNumber)
    {
        using var conn = new NpgsqlConnection(_connectionString);
        string columnName = $"istask{taskNumber}completed";
        string sql = $"UPDATE leaderboard SET {columnName} = TRUE WHERE teamid = @TeamId";
        await conn.ExecuteAsync(sql, new { TeamId = teamId });
    }

}
