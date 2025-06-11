using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class LeaderboardController : ControllerBase
{
    private readonly DbService _db;

    public LeaderboardController(DbService db)
    {
        _db = db;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateTeam([FromBody] CreateTeamRequest request)
    {
        await _db.CreateTeamAsync(request.TeamName);
        return Ok();
    }
}

public class CreateTeamRequest
{
    public string TeamName { get; set; } = string.Empty;
}
