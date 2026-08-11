namespace SkillForge.EmailService.Models;

public sealed class EmailSettings
{
    public bool EnableDelivery { get; set; }
    public string SmtpHost { get; set; } = string.Empty;
    public int SmtpPort { get; set; } = 587;
    public bool UseSsl { get; set; }
    public string SmtpUsername { get; set; } = string.Empty;
    public string SmtpPassword { get; set; } = string.Empty;
    public string FromEmail { get; set; } =
        "no-reply@skillforge.local";
    public string FromName { get; set; } = "SkillForge";
}
