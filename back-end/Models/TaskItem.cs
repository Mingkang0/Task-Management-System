using System.ComponentModel.DataAnnotations;

namespace back_end.Models;
public class TaskItem
{
  public int Id { get; set; }
  public string Title { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  [EnumDataType(typeof(TaskStatus))]
  public TaskStatus Status { get; set; }
  [EnumDataType(typeof(PriorityLevel))]
  public PriorityLevel PriorityLevel { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime? DueDate { get; set; }
  public int UserId { get; set; }
}


public enum TaskStatus { Pending = 0, InProgress = 1, Completed = 2, Cancelled = 3 }

public enum PriorityLevel { Low = 0, Medium = 1, High = 2 }