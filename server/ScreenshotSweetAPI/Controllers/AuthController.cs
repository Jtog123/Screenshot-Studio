using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;


namespace ScreenshotStudio.Controllers
{
        //route will be api/googleauth
    [ApiController]
    [Route("api/[controller]")]
    public class GoogleAuthController : ControllerBase
    {
        [HttpGet("login")]
        public IActionResult Login()
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = "http://localhost:5173/editor"
            };

            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }


    
    }
}



/*

[AllowAnonymous]
public IActionResult GoogleLogin(string returnUrl = "/")
{
    var properties = new AuthenticationProperties { RedirectUri = Url.Action(nameof(GoogleCallback), new { returnUrl }) };
    return Challenge(properties, GoogleDefaults.AuthenticationScheme);
}





[AllowAnonymous]
public async Task<IActionResult> GoogleCallback(string returnUrl = "/")
{
    // Authenticate the result from the Google middleware
    var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

    if (!authenticateResult.Succeeded)
    {
        return BadRequest(); // Handle error
    }

    // You can add custom logic here, e.g., register the user in your database

    // Sign in the user to the local cookie scheme
    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, authenticateResult.Principal, authenticateResult.Properties);

    return LocalRedirect(returnUrl);
}



public async Task<IActionResult> Logout()
{
    await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    // Depending on your setup, you might need to sign out from Google's session as well
    return RedirectToAction("Index", "Home");
}
*/