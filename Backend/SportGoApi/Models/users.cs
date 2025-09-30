using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportGoApi.Models
{
    [Table("OUSR")]
    public class User
    {
        [Key]
        [Column("UserID")]
        public int UserID { get; set; }

        [Required]
        [Column("Username")]
        [MaxLength(50)]
        public string Username { get; set; } = null!; // required con C# 10+

        [Required]
        [Column("PasswordHash")]
        [MaxLength(256)]
        public string PasswordHash { get; set; } = null!;

        [Required]
        [Column("Rol")]
        [MaxLength(30)]
        public string Rol { get; set; } = null!;
    }
}
