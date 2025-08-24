using System.ComponentModel.DataAnnotations;

namespace JobFlow.Api.DTOs;

public record CompanyReadDto(Guid Id, string Name, string? Website, DateTime CreatedAt);

public class CompanyCreateDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Url]
    [MaxLength(300)]
    public string? Website { get; set; }
}

public class CompanyUpdateDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Url]
    [MaxLength(300)]
    public string? Website { get; set; }
}
