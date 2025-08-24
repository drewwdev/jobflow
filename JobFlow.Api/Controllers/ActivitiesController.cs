using JobFlow.Api.Data;
using JobFlow.Api.Data.Entities;
using JobFlow.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobFlow.Api.Controllers;

[ApiController]
[Route("api/applications/{appId:guid}/[controller]")]
public class ActivitiesController : ControllerBase
{
    private readonly AppDbContext _db;
    public ActivitiesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ActivityReadDto>>> List(Guid appId)
    {
        var exists = await _db.Applications.AnyAsync(a => a.Id == appId);
        if (!exists) return NotFound($"Application {appId} not found");

        var items = await _db.Activities
            .AsNoTracking()
            .Where(a => a.ApplicationId == appId)
            .OrderByDescending(a => a.OccurredAt)
            .Select(a => new ActivityReadDto(a.Id, a.ApplicationId, a.Type, a.Body, a.OccurredAt))
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<ActivityReadDto>> Create(Guid appId, [FromBody] ActivityCreateDto dto)
    {
        var exists = await _db.Applications.AnyAsync(a => a.Id == appId);
        if (!exists) return NotFound($"Application {appId} not found");

        var entity = new Activity
        {
            ApplicationId = appId,
            Type = dto.Type,
            Body = dto.Body,
            OccurredAt = dto.OccurredAt ?? DateTime.UtcNow
        };

        _db.Activities.Add(entity);
        await _db.SaveChangesAsync();

        var read = new ActivityReadDto(entity.Id, entity.ApplicationId, entity.Type, entity.Body, entity.OccurredAt);
        return CreatedAtAction(nameof(List), new { appId }, read);
    }
}
