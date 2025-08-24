using System.ComponentModel.DataAnnotations;

namespace JobFlow.Api.Data.Entities;

public class Application
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }


    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? SourceUrl { get; set; }

    [MaxLength(120)]
    public string? Location { get; set; }

    public AppStatus Status { get; set; } = AppStatus.Saved;


    public Guid? CompanyId { get; set; }
    public Company? Company { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? AppliedAt { get; set; }
    public DateTime? InterviewAt { get; set; }
    public DateTime? OfferAt { get; set; }
}
