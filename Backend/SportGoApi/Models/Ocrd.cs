using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportGoApi.Models
{
    [Table("OCRD")] // nombre exacto de la tabla en tu BD
    public class Ocrd
    {
        [Key]
        [Column("CardCode")]
        [StringLength(10)]
        public string CardCode { get; set; } = null!;

        [Required, StringLength(100)]
        [Column("CardName")]
        public string CardName { get; set; } = null!;

        [Required, StringLength(10)]
        [Column("CardType")]
        public string CardType { get; set; } = null!;

        [StringLength(20)]
        [Column("Phone1")]
        public string? Phone1 { get; set; }

        [StringLength(100)]
        [Column("Email")]
        public string? Email { get; set; }

        [StringLength(200)]
        [Column("CardAddress")]
        public string? CardAddress { get; set; }
    }
}
