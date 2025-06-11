# Stage 1: Build React client
FROM node:18 AS client-build
WORKDIR /app
COPY SquidGameCollins.Client/package*.json ./SquidGameCollins.Client/
COPY SquidGameCollins.Client ./SquidGameCollins.Client/
RUN cd SquidGameCollins.Client && npm install && npm run build

# Stage 2: Build .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY SquidGameCollins.Server/*.csproj ./SquidGameCollins.Server/
RUN dotnet restore ./SquidGameCollins.Server/SquidGameCollins.Server.csproj
COPY . .
RUN mkdir -p SquidGameCollins.Server/wwwroot
COPY --from=client-build /app/SquidGameCollins.Client/build SquidGameCollins.Server/wwwroot/
RUN dotnet publish SquidGameCollins.Server/SquidGameCollins.Server.csproj -c Release -o /out

# Stage 3: Run app
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "SquidGameCollins.Server.dll"]