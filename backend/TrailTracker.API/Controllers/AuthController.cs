using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TrailTracker.API.Models;

namespace TrailTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto request)
        {
            // Uproszczenie dla projektu na zaliczenie: logowanie na sztywne dane admina.
            // Wersja produkcyjna wymagałaby sprawdzania zahashowanego hasła w bazie danych.
            if (request.Username == "admin" && request.Password == "admin123")
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.Name, request.Username),
                        new Claim(ClaimTypes.Role, "Admin")
                    }),
                    Expires = DateTime.UtcNow.AddHours(2),
                    Issuer = _configuration["Jwt:Issuer"],
                    Audience = _configuration["Jwt:Audience"],
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                return Ok(new { Token = tokenHandler.WriteToken(token) });
            }

            return Unauthorized(new { Message = "Nieprawidłowy login lub hasło." });
        }
    }
}