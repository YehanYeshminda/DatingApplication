namespace API.Entities
{
    // this method is good for the use of entity framework
    public class AppUser
    {
        public int Id { get; set; } // this is used as the primary key
        public string UserName { get; set; } // this is used as the username
    }
}