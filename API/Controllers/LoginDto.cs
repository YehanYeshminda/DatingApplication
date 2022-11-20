using System.ComponentModel.DataAnnotations;

namespace API.Controllers
{
    public class LoginDto
    {
        [Required] // adding validations into the system
        [MaxLength(10)]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}