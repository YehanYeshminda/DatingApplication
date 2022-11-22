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
    }
}