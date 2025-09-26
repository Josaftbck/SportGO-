using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportGoApi.Data;
using SportGoApi.Models;

namespace SportGoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly SportGoDbContext _context;

        public ItemController(SportGoDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/Item — devuelve solo activos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems()
        {
            return await _context.Items.Where(i => i.Active).ToListAsync();
        }

        // ✅ GET: api/Item/todos — devuelve todos (activos + inactivos)
        [HttpGet("todos")]
        public async Task<ActionResult<IEnumerable<Item>>> GetAllItems()
        {
            return await _context.Items.ToListAsync();
        }

        // ✅ GET: api/Item/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(string id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null || !item.Active)
                return NotFound();
            return item;
        }

        // ✅ POST: api/Item
        [HttpPost]
        public async Task<ActionResult<Item>> PostItem(Item item)
        {
            item.Active = true; // Siempre lo dejamos activo al crear
            _context.Items.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetItem), new { id = item.ItemCode }, item);
        }

        // ✅ PUT: api/Item/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItem(string id, Item item)
        {
            if (id != item.ItemCode)
                return BadRequest("El ID no coincide");

            _context.Entry(item).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Items.Any(e => e.ItemCode == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // ✅ DELETE (lógico): api/Item/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(string id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null || !item.Active)
                return NotFound();

            item.Active = false;
            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ REACTIVAR producto: api/Item/{id}/activar
        [HttpPut("{id}/activar")]
        public async Task<IActionResult> ActivarItem(string id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
                return NotFound();

            item.Active = true;
            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Producto {id} activado." });
        }
    }
}