using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportGoApi.Models
{ //product.  Data Annotations
    [Table("OITM")]
    public class Item
    {
        [Key]
        [Column("ItemCode")]
        public required string ItemCode { get; set; }

        [Column("ItemName")]
        public required string ItemName { get; set; }

        [Column("Price")]
        public decimal Price { get; set; }

        [Column("OnHand")]
        public int OnHand { get; set; }

        [Column("IsCommited")]
        public int IsCommited { get; set; }

        [Column("MaxLevel")]
        public int MaxLevel { get; set; }

        [Column("Active")]
        public bool Active { get; set; }
    }
}