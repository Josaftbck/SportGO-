using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportGoApi.Data;
using SportGoApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SportGoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesPersonController : ControllerBase
    {
        private readonly SportGoDbContext _context;

        public SalesPersonController(SportGoDbContext context)
        {
            _context = context;
        }

        // GET: api/SalesPerson
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesPerson>>> GetAll()
        {
            return await _context.SalesPersons.ToListAsync();
        }

        // GET: api/SalesPerson/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SalesPerson>> Get(int id)
        {
            var sp = await _context.SalesPersons.FindAsync(id);
            if (sp == null) return NotFound();
            return sp;
        }

        // POST: api/SalesPerson
        [HttpPost]
        public async Task<ActionResult<SalesPerson>> Create(SalesPerson sp)
        {
            _context.SalesPersons.Add(sp);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = sp.SlpCode }, sp);
        }

        // PUT: api/SalesPerson/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, SalesPerson sp)
        {
            if (id != sp.SlpCode) return BadRequest();

            _context.Entry(sp).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalesPersonExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/SalesPerson/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var sp = await _context.SalesPersons.FindAsync(id);
            if (sp == null) return NotFound();

            _context.SalesPersons.Remove(sp);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SalesPersonExists(int id)
        {
            return _context.SalesPersons.Any(e => e.SlpCode == id);
        }
    }
}
