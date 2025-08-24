using Microsoft.AspNetCore.Identity;

namespace JobFlow.Api.Data.Auth;

public class ApplicationUser : IdentityUser<Guid>
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
