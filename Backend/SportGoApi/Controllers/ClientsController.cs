using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportGoApi.Data;
using SportGoApi.Models;

namespace SportGoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        private readonly SportGoDbContext _context;

        public ClientsController(SportGoDbContext context)
        {
            _context = context;
        }

        // GET: api/clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ocrd>>> GetClients()
        {
            return await _context.OCRD.AsNoTracking().ToListAsync();
        }

        // GET: api/clients/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Ocrd>> GetClient(string id)
        {
            var client = await _context.OCRD.FindAsync(id);
            if (client == null) return NotFound();
            return client;
        }

        // POST: api/clients
        [HttpPost]
        public async Task<ActionResult<Ocrd>> CreateClient(Ocrd dto)
        {
            if (await _context.OCRD.AnyAsync(c => c.CardCode == dto.CardCode))
                return Conflict(new { message = "CardCode already exists." });

            _context.OCRD.Add(dto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetClient), new { id = dto.CardCode }, dto);
        }

        // PUT: api/clients/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClient(string id, Ocrd dto)
        {
            if (id != dto.CardCode) return BadRequest();

            var existing = await _context.OCRD.FindAsync(id);
            if (existing == null) return NotFound();

            // Actualiza campos permitidos
            existing.CardName = dto.CardName;
            existing.CardType = dto.CardType;
            existing.Phone1 = dto.Phone1;
            existing.Email = dto.Email;
            existing.CardAddress = dto.CardAddress;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/clients/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(string id)
        {
            var existing = await _context.OCRD.FindAsync(id);
            if (existing == null) return NotFound();

            _context.OCRD.Remove(existing);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
