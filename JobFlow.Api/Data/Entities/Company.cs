using System.ComponentModel.DataAnnotations;

namespace JobFlow.Api.Data.Entities;

public class Company
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Website { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
