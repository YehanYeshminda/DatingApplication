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
        [StringLength(8, MinimumLength = 4)] // maximum 8 ,minimum of 4
        public string Password { get; set; }
    }
}