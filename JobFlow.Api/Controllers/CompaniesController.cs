using JobFlow.Api.Data;
using JobFlow.Api.Data.Entities;
using JobFlow.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompaniesController : ControllerBase
{
    private readonly AppDbContext _db;

    public CompaniesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CompanyReadDto>>> List(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize is < 1 or > 100) pageSize = 20;

        var query = _db.Companies.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();
            query = query.Where(c => EF.Functions.ILike(c.Name, $"%{s}%"));
        }

        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CompanyReadDto(c.Id, c.Name, c.Website, c.CreatedAt))
            .ToListAsync();

        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CompanyReadDto>> Get(Guid id)
    {
        var c = await _db.Companies.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (c is null) return NotFound();
        return Ok(new CompanyReadDto(c.Id, c.Name, c.Website, c.CreatedAt));
    }

    [HttpPost]
    public async Task<ActionResult<CompanyReadDto>> Create([FromBody] CompanyCreateDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var entity = new Company
        {
            Name = dto.Name.Trim(),
            Website = string.IsNullOrWhiteSpace(dto.Website) ? null : dto.Website!.Trim()
        };

        _db.Companies.Add(entity);
        await _db.SaveChangesAsync();

        var read = new CompanyReadDto(entity.Id, entity.Name, entity.Website, entity.CreatedAt);
        return CreatedAtAction(nameof(Get), new { id = entity.Id }, read);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CompanyReadDto>> Update(Guid id, [FromBody] CompanyUpdateDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var entity = await _db.Companies.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.Name = dto.Name.Trim();
        entity.Website = string.IsNullOrWhiteSpace(dto.Website) ? null : dto.Website!.Trim();

        await _db.SaveChangesAsync();

        var read = new CompanyReadDto(entity.Id, entity.Name, entity.Website, entity.CreatedAt);
        return Ok(read);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var entity = await _db.Companies.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        _db.Companies.Remove(entity);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
