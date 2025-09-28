using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportGoApi.Data;
using SportGoApi.Models;

namespace SportGoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BranchController : ControllerBase
    {
        private readonly SportGoDbContext _context;

        public BranchController(SportGoDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/branch — devuelve todas las sucursales
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Branch>>> GetBranches()
        {
            return await _context.Branches.ToListAsync();
        }

        // ✅ GET: api/branch/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Branch>> GetBranch(int id)
        {
            var branch = await _context.Branches.FindAsync(id);
            if (branch == null)
                return NotFound();

            return branch;
        }

        // ✅ POST: api/branch
        [HttpPost]
        public async Task<ActionResult<Branch>> PostBranch(Branch branch)
        {
            // 👇 Ya no hay Active, solo crea directo
            _context.Branches.Add(branch);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBranch), new { id = branch.BranchID }, branch);
        }

        // ✅ PUT: api/branch/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBranch(int id, Branch branch)
        {
            if (id != branch.BranchID)
                return BadRequest("El ID no coincide");

            _context.Entry(branch).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Branches.Any(b => b.BranchID == id))
                    return NotFound();

                throw;
            }

            return NoContent();
        }

        // ✅ DELETE físico: api/branch/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBranch(int id)
        {
            var branch = await _context.Branches.FindAsync(id);
            if (branch == null)
                return NotFound();

            _context.Branches.Remove(branch);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}