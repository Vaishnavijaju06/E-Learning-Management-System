using System.Security.Cryptography;
using System.Text;

namespace SkillForge.EmailService.Middleware;

public sealed class InternalApiKeyMiddleware
{
    private const string HeaderName = "X-Internal-Api-Key";
    private readonly RequestDelegate _next;
    private readonly string _expectedKey;

    public InternalApiKeyMiddleware(
        RequestDelegate next,
        IConfiguration configuration
    )
    {
        _next = next;
        _expectedKey =
            configuration["InternalApiKey"]
            ?? "skillforge-email-internal-key";
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (
            context.Request.Path.StartsWithSegments(
                "/api/email/health"
            )
        )
        {
            await _next(context);
            return;
        }

        var suppliedKey =
            context.Request.Headers[HeaderName].FirstOrDefault()
            ?? string.Empty;

        if (!KeysMatch(suppliedKey, _expectedKey))
        {
            context.Response.StatusCode =
                StatusCodes.Status401Unauthorized;

            await context.Response.WriteAsJsonAsync(
                new
                {
                    status = 401,
                    error = "Unauthorized",
                    message = "Missing or invalid internal API key"
                }
            );
            return;
        }

        await _next(context);
    }

    private static bool KeysMatch(
        string supplied,
        string expected
    )
    {
        var suppliedBytes = Encoding.UTF8.GetBytes(supplied);
        var expectedBytes = Encoding.UTF8.GetBytes(expected);

        return suppliedBytes.Length == expectedBytes.Length
            && CryptographicOperations.FixedTimeEquals(
                suppliedBytes,
                expectedBytes
            );
    }
}
