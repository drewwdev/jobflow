using System.Security.Claims;

namespace JobFlow.Api.Extensions;

public static class UserExtensions
{
    public static Guid? GetUserId(this ClaimsPrincipal user)
    {
        var sub = user.FindFirstValue(ClaimTypes.NameIdentifier) 
               ?? user.FindFirstValue(ClaimTypes.Name) 
               ?? user.FindFirstValue("sub");
        return Guid.TryParse(sub, out var id) ? id : null;
    }
}
