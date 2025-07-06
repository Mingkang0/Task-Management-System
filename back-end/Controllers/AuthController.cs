using Microsoft.AspNetCore.Mvc;
using back_end.Models;
using back_end.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;

namespace back_end.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthController : ControllerBase
  {
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
      _context = context;
      _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserDTO userDto)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
        return BadRequest("Email already exists");

      using var hmac = new System.Security.Cryptography.HMACSHA512();
      var user = new User
      {
        Email = userDto.Email,
        PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(userDto.Password)),
        PasswordSalt = hmac.Key
      };
      _context.Users.Add(user);
      await _context.SaveChangesAsync();

      string token = GenerateToken(user);
      return Ok(new { status = true, Token = token, message = "Registration successful" });
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserDTO userDto)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
      if (user == null || verifyPasswordHash(userDto.Password, user.PasswordHash, user.PasswordSalt) == false)
        return Unauthorized("Invalid email or password");

      string token = GenerateToken(user);
      return Ok(new { status = true, Token = token, message = "Login successful" });
    }
    private bool verifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
    {
      using var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt);
      var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
      return computedHash.SequenceEqual(storedHash);
    }

    private string GenerateToken(User user)
    {
      var claims = new List<Claim>
      {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email)
      };

      var jwtKey = _config["Jwt:Key"];
      if (string.IsNullOrEmpty(jwtKey))
        throw new InvalidOperationException("JWT key is not configured.");

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
          issuer: _config["Jwt:Issuer"],
          audience: _config["Jwt:Audience"],
          claims: claims,
          expires: DateTime.Now.AddDays(7),
          signingCredentials: creds
      );

      return new JwtSecurityTokenHandler().WriteToken(token);
    }

  }
}