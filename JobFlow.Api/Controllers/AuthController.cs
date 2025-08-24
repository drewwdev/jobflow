using JobFlow.Api.Data;
using JobFlow.Api.Data.Auth;
using JobFlow.Api.DTOs;
using JobFlow.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _users;
    private readonly TokenService _tokens;
    private readonly AppDbContext _db;
    private readonly IConfiguration _cfg;

    public AuthController(UserManager<ApplicationUser> users, TokenService tokens, AppDbContext db, IConfiguration cfg)
    {
        _users = users; _tokens = tokens; _db = db; _cfg = cfg;
    }

    [HttpPost("register")]
    public async Task<ActionResult<TokenResponse>> Register(RegisterDto dto)
    {
        var exists = await _users.FindByEmailAsync(dto.Email);
        if (exists != null) return Conflict("Email already registered.");

        var user = new ApplicationUser { UserName = dto.Email, Email = dto.Email, EmailConfirmed = true };
        var result = await _users.CreateAsync(user, dto.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);

        return await IssueTokens(user);
    }

    [HttpPost("login")]
    public async Task<ActionResult<TokenResponse>> Login(LoginDto dto)
    {
        var user = await _users.FindByEmailAsync(dto.Email);
        if (user == null) return Unauthorized("Invalid credentials.");

        var ok = await _users.CheckPasswordAsync(user, dto.Password);
        if (!ok) return Unauthorized("Invalid credentials.");

        return await IssueTokens(user);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<TokenResponse>> Refresh([FromBody] string refreshToken)
    {
        var token = await _db.RefreshTokens.Include(r => r.User).FirstOrDefaultAsync(r => r.Token == refreshToken);
        if (token == null || !token.IsActive) return Unauthorized("Invalid refresh token.");

        token.RevokedAt = DateTime.UtcNow;
        var resp = await IssueTokens(token.User);
        await _db.SaveChangesAsync();
        return resp;
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] string refreshToken)
    {
        var token = await _db.RefreshTokens.FirstOrDefaultAsync(r => r.Token == refreshToken);
        if (token != null)
        {
            token.RevokedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
        return NoContent();
    }

    private async Task<TokenResponse> IssueTokens(ApplicationUser user)
    {
        var (access, _) = _tokens.CreateAccessToken(user);

        var days = int.Parse(_cfg["Jwt:RefreshTokenDays"]!);
        var rt = new RefreshToken
        {
            UserId = user.Id,
            Token = _tokens.CreateRefreshToken(),
            ExpiresAt = DateTime.UtcNow.AddDays(days)
        };
        _db.RefreshTokens.Add(rt);
        await _db.SaveChangesAsync();

        return new TokenResponse(access, rt.Token);
    }
}
