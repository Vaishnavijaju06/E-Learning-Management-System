using System.ComponentModel.DataAnnotations;

namespace SkillForge.EmailService.Models;

public sealed class EmailRequest
{
    [Required]
    [EmailAddress]
    public string To { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    public string Body { get; set; } = string.Empty;

    public bool IsHtml { get; set; } = true;
}
