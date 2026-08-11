using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using SkillForge.EmailService.Models;

namespace SkillForge.EmailService.Services;

public sealed class SmtpEmailSender : IEmailSender
{
    private readonly EmailSettings _settings;
    private readonly ILogger<SmtpEmailSender> _logger;

    public SmtpEmailSender(
        IOptions<EmailSettings> options,
        ILogger<SmtpEmailSender> logger
    )
    {
        _settings = options.Value;
        _logger = logger;
    }

    public async Task<EmailDeliveryResult> SendAsync(
        EmailRequest request,
        CancellationToken cancellationToken
    )
    {
        if (!_settings.EnableDelivery)
        {
            _logger.LogInformation(
                "Simulated email to {Recipient}: {Subject}",
                request.To,
                request.Subject
            );

            return new EmailDeliveryResult(
                Delivered: false,
                Simulated: true,
                Message:
                    "Email accepted in simulation mode. Configure SMTP to deliver it."
            );
        }

        if (
            string.IsNullOrWhiteSpace(_settings.SmtpHost)
            || string.IsNullOrWhiteSpace(_settings.FromEmail)
        )
        {
            throw new InvalidOperationException(
                "SMTP host and sender address must be configured."
            );
        }

        var message = new MimeMessage();
        message.From.Add(
            new MailboxAddress(
                _settings.FromName,
                _settings.FromEmail
            )
        );
        message.To.Add(MailboxAddress.Parse(request.To));
        message.Subject = request.Subject;
        message.Body = request.IsHtml
            ? new BodyBuilder { HtmlBody = request.Body }.ToMessageBody()
            : new TextPart("plain") { Text = request.Body };

        using var client = new SmtpClient();
        var socketOptions = _settings.UseSsl
            ? SecureSocketOptions.SslOnConnect
            : SecureSocketOptions.StartTlsWhenAvailable;

        await client.ConnectAsync(
            _settings.SmtpHost,
            _settings.SmtpPort,
            socketOptions,
            cancellationToken
        );

        if (!string.IsNullOrWhiteSpace(_settings.SmtpUsername))
        {
            await client.AuthenticateAsync(
                _settings.SmtpUsername,
                _settings.SmtpPassword,
                cancellationToken
            );
        }

        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(
            true,
            cancellationToken
        );

        return new EmailDeliveryResult(
            Delivered: true,
            Simulated: false,
            Message: "Email delivered."
        );
    }
}
