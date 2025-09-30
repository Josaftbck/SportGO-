using Microsoft.EntityFrameworkCore;
using SportGoApi.Models; // 👈 Asegura que exista este using

namespace SportGoApi.Data
{
    public class SportGoDbContext : DbContext
    {
        public SportGoDbContext(DbContextOptions<SportGoDbContext> options)
            : base(options)

        {
        }

        // 👇 Aquí agregás tus entidades
        public DbSet<Item> Items { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<User> Users { get; set; } // <-- Aquí el nombre de tu modelo

    }
}