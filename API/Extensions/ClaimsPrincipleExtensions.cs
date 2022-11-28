using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetUsername(this ClaimsPrincipal user)
        {
            // from claims get the user name
            return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }
}