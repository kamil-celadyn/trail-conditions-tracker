using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrailTracker.API.Data;
using TrailTracker.API.Models;

namespace TrailTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrailReportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TrailReportsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/TrailReports (Pobiera wszystkie zgłoszenia)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrailReport>>> GetTrailReports()
        {
            return await _context.TrailReports.ToListAsync();
        }

        // POST: api/TrailReports (Dodaje nowe zgłoszenie od turysty)
        [HttpPost]
        public async Task<ActionResult<TrailReport>> PostTrailReport(TrailReport report)
        {
            // Upewniamy się, że czas jest z momentu wysłania, a zgłoszenie nie jest od razu zweryfikowane
            report.CreatedAt = DateTime.UtcNow;
            report.IsVerified = false;

            _context.TrailReports.Add(report);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTrailReports), new { id = report.Id }, report);
        }

        // PUT: api/TrailReports/5 (Aktualizuje zgłoszenie - np. zmiana statusu IsVerified przez Admina)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTrailReport(int id, TrailReport report)
        {
            if (id != report.Id) return BadRequest();

            _context.Entry(report).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TrailReportExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/TrailReports/5 (Usuwa fałszywe zgłoszenia)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrailReport(int id)
        {
            var report = await _context.TrailReports.FindAsync(id);
            if (report == null) return NotFound();

            _context.TrailReports.Remove(report);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TrailReportExists(int id)
        {
            return _context.TrailReports.Any(e => e.Id == id);
        }
    }
}