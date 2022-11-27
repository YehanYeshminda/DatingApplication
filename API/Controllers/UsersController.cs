using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{
    [Authorize] // in order to add authorization to the application
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        // then we intialize the data context
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet] // returns all the users as a paused method which is task
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers() // the dto is used to define the data which is needed to be returned
        {
            return Ok(await _userRepository.GetMembersAsync());
        }

        [HttpGet("{username}")] // returns a user using a id  as a paused method which is task
        public async Task<ActionResult<MemberDto>> GetUserByUsername(string username)
        {
            return await _userRepository.GetMemberAsync(username); // will directly return a member dto
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            // this is gotten from the identity of the user
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // make sure to debug and check this

            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null) return NotFound();

            // will upate all the properties which we pass to the MemberUpdateDto and overwrite the properties in the user which is retrived
            _mapper.Map(memberUpdateDto, user);

            if (await _userRepository.SaveAllAsync()) return NoContent(); // 204

            // if there were changes to be saved
            return BadRequest("Failed to update user");
        }
    }
}