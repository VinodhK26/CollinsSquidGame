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
        try
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
        catch (Exception ex)
        {
            Console.WriteLine($"[DB ERROR - GetLeaderboardStateAsync] {ex.Message}");
            throw;
        }
    }

    public async Task CreateTeamAsync(string teamName)
    {
        try
        {
            using var conn = new NpgsqlConnection(_connectionString);
            string sql = @"
            INSERT INTO leaderboard (teamname, istask1completed, istask2completed, istask3completed, istask4completed)
            VALUES (@TeamName, false, false, false, false)";
            await conn.ExecuteAsync(sql, new { TeamName = teamName });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DB ERROR - CreateTeamAsync] {ex.Message}");
            throw;
        }
    }



    public async Task<List<string>> GetTeamNamesAsync()
    {
        using var conn = new NpgsqlConnection(_connectionString);
        var result = await conn.QueryAsync<string>("SELECT teamname FROM leaderboard");
        return result.ToList();
    }

    public async Task<bool> ToggleTaskAsync(int teamId, int taskNumber)
    {
        try
        {
            using var conn = new NpgsqlConnection(_connectionString);
            string column = $"istask{taskNumber}completed";

            if (taskNumber is < 1 or > 4)
                throw new ArgumentException("Invalid task number");

            // Toggle the boolean
            string toggleSql = $"UPDATE leaderboard SET {column} = NOT {column} WHERE teamid = @TeamId";
            await conn.ExecuteAsync(toggleSql, new { TeamId = teamId });

            // Fetch the new value
            string fetchSql = $"SELECT {column} FROM leaderboard WHERE teamid = @TeamId";
            bool newValue = await conn.QuerySingleAsync<bool>(fetchSql, new { TeamId = teamId });

            return newValue;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DB ERROR - ToggleTaskAsync] {ex.Message}");
            throw;
        }
    }

}
