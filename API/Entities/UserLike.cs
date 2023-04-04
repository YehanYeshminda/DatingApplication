namespace API.Entities
{
    public class UserLike
    {
        public AppUser SourceUser { get; set; } // whos liking
        public int SourceUserId { get; set; }
        public AppUser TargetUser { get; set; } // who we are liking to
        public int TargetUserId { get; set; }
    }
}