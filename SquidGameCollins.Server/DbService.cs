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
