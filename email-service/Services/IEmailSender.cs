using SkillForge.EmailService.Models;

namespace SkillForge.EmailService.Services;

public interface IEmailSender
{
    Task<EmailDeliveryResult> SendAsync(
        EmailRequest request,
        CancellationToken cancellationToken
    );
}
