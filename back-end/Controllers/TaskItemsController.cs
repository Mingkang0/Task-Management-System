using Microsoft.AspNetCore.Mvc;
using back_end.Models;
using back_end.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace back_end.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class TaskItemsController : ControllerBase
  {
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public TaskItemsController(AppDbContext context, IConfiguration config)
    {
      _context = context;
      _config = config;
    }

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAllTasks()
    {
      var tasks = await _context.TaskItems.ToListAsync();

      return Ok(new
      {
        status = true,
        message = "Tasks fetched successfully",
        data = tasks
      });
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateTask([FromBody] TasksDto taskDto)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

      var TaskItem = new TaskItem
      {
        Title = taskDto.Title,
        Description = taskDto.Description,
        Status = taskDto.Status,
        PriorityLevel = taskDto.PriorityLevel,
        DueDate = taskDto.DueDate,
        CreatedAt = DateTime.UtcNow,
        UserId = userId != null ? int.Parse(userId) : 0
      };

      _context.TaskItems.Add(TaskItem);
      await _context.SaveChangesAsync();

      return Ok(new { status = true, message = "Task created successfully", data = TaskItem });
    }

    [HttpGet("get/{id}")]
    public async Task<IActionResult> GetTaskById(int id)
    {
      var task = await _context.TaskItems.FindAsync(id);
      if (task == null)
        return NotFound("Task not found");

      return Ok(new
      {
        status = true,
        message = "Task fetched successfully",
        data = task
      });
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] TasksDto taskDto)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var task = await _context.TaskItems.FindAsync(id);
      if (task == null)
        return NotFound("Task not found");

      task.Title = taskDto.Title;
      task.Description = taskDto.Description;
      task.Status = taskDto.Status;
      task.PriorityLevel = taskDto.PriorityLevel;
      task.DueDate = taskDto.DueDate;

      _context.TaskItems.Update(task);
      await _context.SaveChangesAsync();

      return Ok(new { status = true, message = "Task updated successfully", data = task });
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
      var task = await _context.TaskItems.FindAsync(id);
      if (task == null)
        return NotFound("Task not found");

      _context.TaskItems.Remove(task);
      await _context.SaveChangesAsync();

      return Ok(new { status = true, message = "Task deleted successfully" });
    }

  }

}


