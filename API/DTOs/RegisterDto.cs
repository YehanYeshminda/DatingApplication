using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class RegisterDto
    {
        // this is simply the values which the dto will take as input and send a output
        
        [Required] // adding validations into the system
        [MaxLength(10)]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}