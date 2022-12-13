using Microsoft.AspNetCore.Identity;

namespace API.Entities // represents the join table between appuser and approle
{
    public class AppUserRole : IdentityUserRole<int>
    {
        public AppUser User { get; set; }
        public AppRole Role { get; set; }
    }
}