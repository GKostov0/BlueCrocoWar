using BlueCrocoWar.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddSignalR(e => 
{
    //e.EnableDetailedErrors = true;
    //e.MaximumReceiveMessageSize = 102400000;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSignalR",
        policy =>
        {
            policy.WithOrigins("http://localhost:8080")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSignalR");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapHub<GameHub>("/gameHub");

app.Run();
