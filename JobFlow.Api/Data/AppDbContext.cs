using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using JobFlow.Api.Data.Auth;
using JobFlow.Api.Data.Entities;

namespace JobFlow.Api.Data;

public class AppDbContext
  : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Company> Companies => Set<Company>();
    public DbSet<Application> Applications => Set<Application>();
    public DbSet<Activity> Activities => Set<Activity>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        foreach (var e in ChangeTracker.Entries<Application>())
            if (e.State == EntityState.Modified) e.Entity.UpdatedAt = now;
        return base.SaveChangesAsync(cancellationToken);
    }
}
