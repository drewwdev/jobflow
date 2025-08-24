using System.ComponentModel.DataAnnotations;

namespace JobFlow.Api.DTOs;

public record ActivityReadDto(Guid Id, Guid ApplicationId, string Type, string Body, DateTime OccurredAt);

public class ActivityCreateDto
{
    [Required, MaxLength(50)]
    public string Type { get; set; } = "Note";

    [Required, MaxLength(1000)]
    public string Body { get; set; } = string.Empty;

    public DateTime? OccurredAt { get; set; }
}
