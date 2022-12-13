using API.Extensions;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    // this method is good for the use of entity framework
    public class AppUser : IdentityUser<int>
    {
        public DateTime DateOfBirth { get; set; } = DateTime.Now;
        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; } = DateTime.Now;
        public string Gender { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public List<Photo> Photos { get; set; } = new(); // 1 user will have many photos
        public List<UserLike> LikedByUsers { get; set; } // many users will have many likebyusers
        public List<UserLike> LikedUsers { get; set; } // many users will have many liked users

        public List<Message> MessagesSent { get; set; } // many users will have many messages sent
        public List<Message> MessagesReceived { get; set; } // many users will have many messages received
        public ICollection<AppUserRole> UserRoles { get; set; }
        
    }
}