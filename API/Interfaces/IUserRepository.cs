using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<Boolean> SaveAllAsync();
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username); 
        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams); // when we use pagination
        // Task<IEnumerable<MemberDto>> GetMembersAsync(); // if we dont use pagination use this
        Task<MemberDto> GetMemberAsync(string username);
    }
}