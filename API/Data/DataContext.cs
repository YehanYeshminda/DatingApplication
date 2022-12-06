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
        public DbSet<UserLike> Likes { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserLike>()
                .HasKey(k => new {k.SourceUserId, k.TargetUserId}); // this will represent the primary key which is used

            builder.Entity<UserLike>()
                .HasOne(s => s.SourceUser)
                .WithMany(l => l.LikedUsers) // one user can have many liked users
                .HasForeignKey(s => s.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserLike>()
                .HasOne(s => s.TargetUser)
                .WithMany(l => l.LikedByUsers)
                .HasForeignKey(k => k.TargetUserId)
                .OnDelete(DeleteBehavior.NoAction); // no action is to be only given in SQL server no cancade can be given in this as well in other databases
        }
    }
}