using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration _config)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ITokenService, TokenService>(); // for the token service
            services.AddScoped<IPhotoService, PhotoService>(); // image upload service
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly); // used for the automapper to and find the profiles

            // making the reference to the data context
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlServer(_config.GetConnectionString("DefaultConnection"));
            });

            services.Configure<CloudinarySettings>(_config.GetSection("CloudinarySettings")); // the same as given in in the globals

            return services;
        }
    }
}