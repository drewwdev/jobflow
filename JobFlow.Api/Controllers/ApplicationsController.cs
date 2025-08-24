using JobFlow.Api.Data;
using JobFlow.Api.Data.Entities;
using JobFlow.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ApplicationsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApplicationReadDto>>> List(
        [FromQuery] AppStatus? status,
        [FromQuery] string? q,
        [FromQuery] Guid? companyId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize is < 1 or > 100) pageSize = 20;

        var query = _db.Applications.AsNoTracking().Include(a => a.Company).AsQueryable();

        if (status.HasValue) query = query.Where(a => a.Status == status.Value);
        if (companyId.HasValue) query = query.Where(a => a.CompanyId == companyId.Value);
        if (!string.IsNullOrWhiteSpace(q))
        {
            var s = q.Trim();
            query = query.Where(a =>
                EF.Functions.ILike(a.Title, $"%{s}%") ||
                (a.Location != null && EF.Functions.ILike(a.Location, $"%{s}%")) ||
                (a.SourceUrl != null && EF.Functions.ILike(a.SourceUrl, $"%{s}%")) ||
                (a.Company != null && EF.Functions.ILike(a.Company.Name, $"%{s}%"))
            );
        }

        var items = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new ApplicationReadDto(
                a.Id, a.Title, a.SourceUrl, a.Location, a.Status,
                a.CompanyId, a.Company != null ? a.Company.Name : null,
                a.CreatedAt, a.UpdatedAt, a.AppliedAt, a.InterviewAt, a.OfferAt
            ))
            .ToListAsync();

        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApplicationReadDto>> Get(Guid id)
    {
        var a = await _db.Applications.AsNoTracking().Include(x => x.Company).FirstOrDefaultAsync(x => x.Id == id);
        if (a is null) return NotFound();

        return Ok(new ApplicationReadDto(
            a.Id, a.Title, a.SourceUrl, a.Location, a.Status,
            a.CompanyId, a.Company?.Name,
            a.CreatedAt, a.UpdatedAt, a.AppliedAt, a.InterviewAt, a.OfferAt
        ));
    }

    [HttpPost]
    public async Task<ActionResult<ApplicationReadDto>> Create([FromBody] ApplicationCreateDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var entity = new Application
        {
            Title = dto.Title.Trim(),
            SourceUrl = string.IsNullOrWhiteSpace(dto.SourceUrl) ? null : dto.SourceUrl!.Trim(),
            Location = string.IsNullOrWhiteSpace(dto.Location) ? null : dto.Location!.Trim(),
            Status = dto.Status,
            CompanyId = dto.CompanyId
        };

        _db.Applications.Add(entity);
        await _db.SaveChangesAsync();

        var read = await _db.Applications.AsNoTracking()
            .Include(a => a.Company)
            .Where(a => a.Id == entity.Id)
            .Select(a => new ApplicationReadDto(
                a.Id, a.Title, a.SourceUrl, a.Location, a.Status,
                a.CompanyId, a.Company != null ? a.Company.Name : null,
                a.CreatedAt, a.UpdatedAt, a.AppliedAt, a.InterviewAt, a.OfferAt
            )).FirstAsync();

        return CreatedAtAction(nameof(Get), new { id = entity.Id }, read);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApplicationReadDto>> Update(Guid id, [FromBody] ApplicationUpdateDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var entity = await _db.Applications.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.Title = dto.Title.Trim();
        entity.SourceUrl = string.IsNullOrWhiteSpace(dto.SourceUrl) ? null : dto.SourceUrl!.Trim();
        entity.Location = string.IsNullOrWhiteSpace(dto.Location) ? null : dto.Location!.Trim();
        entity.Status = dto.Status;
        entity.CompanyId = dto.CompanyId;
        entity.AppliedAt = dto.AppliedAt;
        entity.InterviewAt = dto.InterviewAt;
        entity.OfferAt = dto.OfferAt;

        await _db.SaveChangesAsync();

        var read = await _db.Applications.AsNoTracking()
            .Include(a => a.Company)
            .Where(a => a.Id == id)
            .Select(a => new ApplicationReadDto(
                a.Id, a.Title, a.SourceUrl, a.Location, a.Status,
                a.CompanyId, a.Company != null ? a.Company.Name : null,
                a.CreatedAt, a.UpdatedAt, a.AppliedAt, a.InterviewAt, a.OfferAt
            )).FirstAsync();

        return Ok(read);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var entity = await _db.Applications.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();
        _db.Applications.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
