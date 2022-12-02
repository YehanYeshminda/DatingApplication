using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {

        // 1 job which is to update the current user by getting the username using claims
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return; // gets if the user is authenticated or not

            var username = resultContext.HttpContext.User.GetUsername();

            var repo = resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository>();
            var user = await repo.GetUserByUsernameAsync(username);

            user.LastActive = DateTime.UtcNow;

            await repo.SaveAllAsync();
        }
    }
}