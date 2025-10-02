using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportGoApi.Models
{
    [Table("OSLP")]
    public class SalesPerson
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SlpCode { get; set; }  // Clave primaria, autoincremental

        [StringLength(200)]
        public string SlpName { get; set; }  // Nombre del vendedor

        [StringLength(100)]
        public string Position { get; set; }  // Puesto del vendedor

        [Column(TypeName = "date")]
        public DateTime? AdmissionDate { get; set; }  // Fecha de ingreso, nullable

        public int? UserID { get; set; }  // Foreign Key opcional
    }
}
