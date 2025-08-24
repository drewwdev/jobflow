using System.ComponentModel.DataAnnotations;

namespace JobFlow.Api.DTOs;

public class RegisterDto
{
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Required] public string Password { get; set; } = string.Empty;
}

public class LoginDto
{
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Required] public string Password { get; set; } = string.Empty;
}

public record TokenResponse(string AccessToken, string RefreshToken);
