using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Photos")] // in order to add custom names for the tables
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; } // this is used to delete and returned when a photo is uploaded
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
    }
}