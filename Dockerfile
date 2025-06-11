# Stage 1: Build React + .NET with Node.js support
FROM mcr.microsoft.com/dotnet/sdk:8.0-node AS build
WORKDIR /app

# Restore backend dependencies
COPY SquidGameCollins.Server/*.csproj ./SquidGameCollins.Server/
RUN dotnet restore ./SquidGameCollins.Server/SquidGameCollins.Server.csproj

# Copy all source code
COPY . ./

# Build the React frontend
WORKDIR /app/SquidGameCollins.Client
RUN npm install
RUN npm run build

# Copy the React build into ASP.NET wwwroot
WORKDIR /app
RUN mkdir -p SquidGameCollins.Server/wwwroot
RUN cp -r SquidGameCollins.Client/build/* SquidGameCollins.Server/wwwroot/

# Publish the backend
RUN dotnet publish SquidGameCollins.Server/SquidGameCollins.Server.csproj -c Release -o /out

# Stage 2: Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out ./
ENTRYPOINT ["dotnet", "SquidGameCollins.Server.dll"]
