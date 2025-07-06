using System.ComponentModel.DataAnnotations;

namespace back_end.Models 
{
  public class TasksDto {
    [Required(ErrorMessage = "Title is required")]
    [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Status is required")]
    public TaskStatus Status { get; set; }

    [Required(ErrorMessage = "Priority level is required")]
    public PriorityLevel PriorityLevel { get; set; }

    public DateTime? DueDate { get; set; }
  }
}