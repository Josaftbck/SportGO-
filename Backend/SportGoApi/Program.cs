using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using SportGoApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Habilitar controladores MVC
builder.Services.AddControllers();

// ✅ Configuración CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
    );
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SportGo API",
        Version = "v1"
    });
});

// SQL Server Connection
builder.Services.AddDbContext<SportGoDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SportGoDB")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SportGo API V1");
    });
}

// ✅ Middleware CORS (ANTES de redirección y controladores)
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.MapControllers();

app.Run();