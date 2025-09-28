using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportGoApi.Models
{
    [Table("BRANCH")] // importante: esta es la tabla exacta de SQL
    public class Branch
    {
        [Key]
        public int BranchID { get; set; }

        [Required]
        [StringLength(100)]
        public string BranchName { get; set; }

        [StringLength(200)]
        public string BranchAddress { get; set; }
    }
}