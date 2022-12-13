using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper; // in order to use the auto mapper
            _tokenService = tokenService; // in order to use the token service
            _context = context; // in order to use the context we should always initialize
        }

        [HttpPost("register")] // this automatically binds to the parameters
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Username is already taken"); // this will be a 400 request 

            var user = _mapper.Map<AppUser>(registerDto);

            user.UserName = registerDto.Username.ToLower();
    
            _context.Users.Add(user);
            await _context.SaveChangesAsync(); // saving the users into the data table inside of the database

            // in order to send the information back as a token service
            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender,
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // we could use firstOrDefault as well
            var user = await _context.Users.Include(p => p.Photos)
                                           .SingleOrDefaultAsync(x => x.UserName == loginDto.Username); // getting the user

            if (user == null) return Unauthorized("Invalid username");

            // in order to send the information back as a token service
            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                photoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender,
            };
        }

        // checking if the user name is already existinng inside of the database
        [HttpGet]
        public async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower()); // checking if any username matches the username passed
        }
    }
}