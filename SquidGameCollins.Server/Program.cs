using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Bind to Railway's dynamic port or default to 8080
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://*:{port}");

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins("https://collinslbsqgame.up.railway.app")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Middleware
app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();
app.MapHub<TaskHub>("/taskHub");
app.MapFallbackToFile("/index.html");

app.MapGet("/", () => "SignalR Leaderboard Backend is running");
Console.WriteLine($"App is listening on port {port}");
app.Run();
