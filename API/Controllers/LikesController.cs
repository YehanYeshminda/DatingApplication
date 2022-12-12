using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly ILikesRepository _likesRepository;
        public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
        {
            _likesRepository = likesRepository;
            _userRepository = userRepository;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLikes(string username)
        {
            var sourceUserId = User.GetUserId();
            var LikedUser = await _userRepository.GetUserByUsernameAsync(username);
            var SourceUser = await _likesRepository.GetUserWithLikes(sourceUserId);

            if (LikedUser == null) return NotFound();

            if (SourceUser.UserName == username) return BadRequest("You cannot like yourself");

            var userLike = await _likesRepository.GetUserLike(sourceUserId, LikedUser.Id);
            
            if (userLike != null) return BadRequest("You already likes this user!");

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = LikedUser.Id,
            };

            SourceUser.LikedUsers.Add(userLike);
            
            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to like user");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
        {
            // add pagination for the likes inside of the application
            likesParams.UserId = User.GetUserId();
            var users = await _likesRepository.GetUserLikes(likesParams);

            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage,
                                                              users.PageSize,
                                                              users.TotalCount,
                                                              users.TotalPages));
            return Ok(users);
        }
    }
}