using System.ComponentModel.DataAnnotations;
using JobFlow.Api.Data.Entities;

namespace JobFlow.Api.DTOs;

public record ApplicationReadDto(
    Guid Id, string Title, string? SourceUrl, string? Location,
    AppStatus Status, Guid? CompanyId, string? CompanyName,
    DateTime CreatedAt, DateTime UpdatedAt,
    DateTime? AppliedAt, DateTime? InterviewAt, DateTime? OfferAt
);

public class ApplicationCreateDto
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Url, MaxLength(300)]
    public string? SourceUrl { get; set; }

    [MaxLength(120)]
    public string? Location { get; set; }

    public AppStatus Status { get; set; } = AppStatus.Saved;

    public Guid? CompanyId { get; set; }
}

public class ApplicationUpdateDto
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Url, MaxLength(300)]
    public string? SourceUrl { get; set; }

    [MaxLength(120)]
    public string? Location { get; set; }

    public AppStatus Status { get; set; } = AppStatus.Saved;

    public Guid? CompanyId { get; set; }

    public DateTime? AppliedAt { get; set; }
    public DateTime? InterviewAt { get; set; }
    public DateTime? OfferAt { get; set; }
}
