using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    [Authorize] // in order to add authorization to the application
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        // then we intialize the data context
        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet] // returns all the users as a paused method which is task
        public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
        {
            // getting the current users username
            var currentUser = await _userRepository.GetUserByUsernameAsync(User.GetUsername()); 
            userParams.CurrentUsername = currentUser.UserName;

            if(string.IsNullOrEmpty(userParams.Gender)){
                userParams.Gender = currentUser.Gender == "male" ? "female" : "male";
            }

            var users = await _userRepository.GetMembersAsync(userParams);

            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage,
                                                              users.PageSize,
                                                              users.TotalCount,
                                                              users.TotalPages));
            return Ok(users);
        }

        // if we return users without pagination
        // [HttpGet] // returns all the users as a paused method which is task
        // public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers() // the dto is used to define the data which is needed to be returned
        // {
        //     return Ok(await _userRepository.GetMembersAsync());
        // }

        [HttpGet("{username}")] // returns a user using a id  as a paused method which is task
        public async Task<ActionResult<MemberDto>> GetUserByUsername(string username)
        {
            return await _userRepository.GetMemberAsync(username); // will directly return a member dto
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.GetUsername(); // make sure to debug and check this

            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null) return NotFound();

            // will upate all the properties which we pass to the MemberUpdateDto and overwrite the properties in the user which is retrived
            _mapper.Map(memberUpdateDto, user);

            if (await _userRepository.SaveAllAsync()) return NoContent(); // 204

            // if there were changes to be saved
            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null) return NotFound();

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message); // if a error occurs

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            // if the first photo being uploaded we set it to main
            if (user.Photos.Count == 0) photo.IsMain = true;

            user.Photos.Add(photo);

            if (await _userRepository.SaveAllAsync())
            {
                // map from the photodto to the photo
                return CreatedAtAction(nameof(GetUserByUsername),
                                       new { username = user.UserName },
                                       _mapper.Map<PhotoDto>(photo)); // returns with the saved location
            };

            return BadRequest("Problem adding photo");

        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null) return NotFound();

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId); // getting the photo from the photo id

            if (photo == null) return NotFound();

            if (photo.IsMain) return BadRequest("Photo is already the main photo");

            var currentMainPhoto = user.Photos.FirstOrDefault(x => x.IsMain);

            if (currentMainPhoto != null) currentMainPhoto.IsMain = false;          // which means we already have a photo which is set to null or to true

            photo.IsMain = true; // the current which we choose to true

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Problem setting main photo!");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null) return NotFound();

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo == null) return NotFound();

            if (photo.IsMain) return BadRequest("You cannot delete your main photo");

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message); // this is gotten from cloudinary
            }

            user.Photos.Remove(photo);

            if (await _userRepository.SaveAllAsync()) return Ok(); // this is returned when a request is complete

            return BadRequest("Problem deleting the photo");
        }

    }
}