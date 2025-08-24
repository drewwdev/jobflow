using JobFlow.Api.Data;
using JobFlow.Api.Data.Entities;
using JobFlow.Api.DTOs;
using JobFlow.Api.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobFlow.Api.Controllers;

[ApiController]
[Route("api/applications/{appId:guid}/[controller]")]
[Authorize]
public class ActivitiesController : ControllerBase
{
    private readonly AppDbContext _db;
    public ActivitiesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ActivityReadDto>>> List(Guid appId)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        var exists = await _db.Applications.AnyAsync(a => a.Id == appId && a.UserId == userId);
        if (!exists) return NotFound();

        var items = await _db.Activities
            .AsNoTracking()
            .Where(a => a.ApplicationId == appId && a.UserId == userId)
            .OrderByDescending(a => a.OccurredAt)
            .Select(a => new ActivityReadDto(a.Id, a.ApplicationId, a.Type, a.Body, a.OccurredAt))
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<ActivityReadDto>> Create(Guid appId, [FromBody] ActivityCreateDto dto)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        var exists = await _db.Applications.AnyAsync(a => a.Id == appId && a.UserId == userId);
        if (!exists) return NotFound();

        var entity = new Activity
        {
            ApplicationId = appId,
            UserId = userId.Value,
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
