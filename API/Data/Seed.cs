using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext context) 
        {
            if (await context.Users.AnyAsync()) return; // if we have any users inside of the data then return

            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData); // json data gets parsed in to the method as a app user
            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();
                context.Users.Add(user);
            }
            await context.SaveChangesAsync();
        } 
    }
}