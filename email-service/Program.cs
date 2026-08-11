using System.ComponentModel.DataAnnotations;
using SkillForge.EmailService.Middleware;
using SkillForge.EmailService.Models;
using SkillForge.EmailService.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("Email")
);
builder.Services.AddScoped<IEmailSender, SmtpEmailSender>();
builder.Services.AddHealthChecks();

var app = builder.Build();

app.UseMiddleware<InternalApiKeyMiddleware>();

app.MapGet(
    "/api/email/health",
    () =>
        Results.Ok(
            new
            {
                status = "UP",
                service = "skillforge-email-service"
            }
        )
);

app.MapPost(
    "/api/email/send",
    async (
        EmailRequest request,
        IEmailSender sender,
        CancellationToken cancellationToken
    ) =>
    {
        var validationResults = new List<ValidationResult>();
        var valid = Validator.TryValidateObject(
            request,
            new ValidationContext(request),
            validationResults,
            validateAllProperties: true
        );

        if (!valid)
        {
            return Results.ValidationProblem(
                validationResults
                    .GroupBy(
                        result =>
                            result.MemberNames.FirstOrDefault()
                            ?? "request"
                    )
                    .ToDictionary(
                        group => group.Key,
                        group =>
                            group
                                .Select(
                                    result =>
                                        result.ErrorMessage
                                        ?? "Invalid value"
                                )
                                .ToArray()
                    )
            );
        }

        try
        {
            var result = await sender.SendAsync(
                request,
                cancellationToken
            );
            return Results.Ok(result);
        }
        catch (Exception exception)
        {
            app.Logger.LogError(
                exception,
                "Email delivery failed"
            );

            return Results.Problem(
                statusCode:
                    StatusCodes.Status502BadGateway,
                title: "Email delivery failed",
                detail:
                    "The SMTP server rejected or could not deliver the message."
            );
        }
    }
);

app.Run();

public partial class Program
{
}
