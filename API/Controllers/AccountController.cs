using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;

        public AccountController(DataContext context)
        {
            _context = context; // in order to use the context we should always initialize
        }

        [HttpPost("register")] // this automatically binds to the parameters
        public async Task<ActionResult<AppUser>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Username is already taken"); // this will be a 400 request 

            using var hmac = new HMACSHA512(); // provides with the hashing algorithm and will be disposed of correctly

            var user = new AppUser
            {
                UserName = registerDto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)), // used in order to pass the password as a byte array
                PasswordSalt = hmac.Key,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync(); // saving the users into the data table inside of the database

            return user;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(LoginDto loginDto)
        {
            // we could use firstOrDefault as well
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == loginDto.Username); // getting the user

            if (user == null) return Unauthorized("Invalid username");

            using var hmac = new HMACSHA512(user.PasswordSalt); // we create encryption for the user password salt since this will give the same salt

            var computerHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computerHash.Length; i++)
            {
                // checking if the password is valid
                if (computerHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password"); // returns 401 bad request
            }

            return user;
        }



        // checking if the user name is already existinng inside of the database
        public async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower()); // checking if any username matches the username passed
        }
    }
}