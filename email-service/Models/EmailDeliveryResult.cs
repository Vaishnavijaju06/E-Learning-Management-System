namespace SkillForge.EmailService.Models;

public sealed record EmailDeliveryResult(
    bool Delivered,
    bool Simulated,
    string Message
);
