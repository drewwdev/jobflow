# --- build stage ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj and restore first (layer caching)
COPY *.csproj ./
RUN dotnet restore ./JobFlow.Api.csproj

# copy the rest
COPY . .
RUN dotnet publish ./JobFlow.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# --- runtime stage ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Set to Production later in real deploys
ENV ASPNETCORE_ENVIRONMENT=Development

ENTRYPOINT ["dotnet", "JobFlow.Api.dll"]
