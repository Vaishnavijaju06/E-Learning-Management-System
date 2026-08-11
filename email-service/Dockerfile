FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

COPY SkillForge.EmailService.csproj ./
RUN dotnet restore SkillForge.EmailService.csproj

COPY . .

RUN dotnet publish SkillForge.EmailService.csproj \
    -c Release \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false


FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim

WORKDIR /app

COPY --from=build /app/publish .

USER app

EXPOSE 8082

ENTRYPOINT ["dotnet", "SkillForge.EmailService.dll"]