using System.ComponentModel.DataAnnotations;

namespace JobFlow.Api.Data.Entities;

public class Activity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid ApplicationId { get; set; }
    public Application Application { get; set; } = null!;

    [Required, MaxLength(50)]
    public string Type { get; set; } = "Note";

    [Required, MaxLength(1000)]
    public string Body { get; set; } = string.Empty;

    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
}
