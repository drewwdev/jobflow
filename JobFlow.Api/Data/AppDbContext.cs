using JobFlow.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace JobFlow.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Company> Companies { get; set; } = null!;
    public DbSet<Application> Applications { get; set; } = null!;
    public DbSet<Activity> Activities { get; set; } = null!;


    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        foreach (var e in ChangeTracker.Entries<Application>())
        {
            if (e.State == EntityState.Modified)
                e.Entity.UpdatedAt = now;
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}
