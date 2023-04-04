using System.Net.Http.Headers;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;
        public LikesRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<UserLike> GetUserLike(int sourceUserId, int targetUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, targetUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikedParams likedParams)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable(); // get a list of users ordered by the username query
            var likes = _context.Likes.AsQueryable();

            if (likedParams.Predicate == "liked")
            {
                likes = likes.Where(l => l.SourceUserId == likedParams.UserId);
                users = likes.Select(l => l.TargetUser);
            }

            if (likedParams.Predicate == "likedBy")
            {
                likes = likes.Where(l => l.TargetUserId == likedParams.UserId);
                users = likes.Select(l => l.SourceUser);
            }

            var likedUsers = users.Select(user => new LikeDto
            {
                Id = user.Id,
                UserName = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                City = user.City
            });

            return await PagedList<LikeDto>.CreateAsync(likedUsers, likedParams.PageNumber, likedParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users
                .Include(x => x.LikedUsers)
                .FirstOrDefaultAsync(x => x.Id == userId); // used to check if the user has already been liked by another user
        }
    }
}