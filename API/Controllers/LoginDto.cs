using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

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