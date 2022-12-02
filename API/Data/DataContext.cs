using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext // import the following to use the context options
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        // in order to create a new entity
        public DbSet<AppUser> Users { get; set; }
    }
}