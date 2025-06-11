# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy and restore
COPY SquidGameCollins.Server/*.csproj ./SquidGameCollins.Server/
RUN dotnet restore ./SquidGameCollins.Server/SquidGameCollins.Server.csproj

# Copy rest and publish
COPY . ./
RUN dotnet publish SquidGameCollins.Server/SquidGameCollins.Server.csproj -c Release -o /out --verbosity detailed

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out ./
ENTRYPOINT ["dotnet", "SquidGameCollins.Server.dll"]
