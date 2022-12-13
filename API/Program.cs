using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API
{
    public class Program
    {
        // when the application starts this is the command that runs first
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            using var Scope = host.Services.CreateScope();
            var services = Scope.ServiceProvider; 

            try
            {
                var context = services.GetRequiredService<DataContext>();
                var userManager = services.GetRequiredService<UserManager<AppUser>>();
                await context.Database.MigrateAsync(); // will create the migrations
                await Seed.SeedUsers(userManager); // this is used to seed the data
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "an error occured during the migration");
            }

            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>(); // the configuration from the startup is being injected
                });
    }
}
