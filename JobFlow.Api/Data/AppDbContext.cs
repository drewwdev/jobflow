using JobFlow.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace JobFlow.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }
    public DbSet<Company> Companies { get; set; } = null!;

    // We'll add DbSets here soon
}
