# Stage 1: Build React frontend
FROM node:18 AS client-build
WORKDIR /app
COPY SquidGameCollins.Client/package*.json ./SquidGameCollins.Client/
RUN cd SquidGameCollins.Client && npm install
COPY SquidGameCollins.Client ./SquidGameCollins.Client
RUN cd SquidGameCollins.Client && npm run build

# Stage 2: Build .NET backend and integrate React build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore
COPY SquidGameCollins.Server/*.csproj ./SquidGameCollins.Server/
RUN dotnet restore ./SquidGameCollins.Server/SquidGameCollins.Server.csproj

# Copy all project files
COPY . ./

# Copy React build output into wwwroot of backend
RUN mkdir -p SquidGameCollins.Server/wwwroot
COPY --from=client-build /app/SquidGameCollins.Client/build/ SquidGameCollins.Server/wwwroot/

# Publish the backend
RUN dotnet publish SquidGameCollins.Server/SquidGameCollins.Server.csproj -c Release -o /out

# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out ./
ENTRYPOINT ["dotnet", "SquidGameCollins.Server.dll"]
