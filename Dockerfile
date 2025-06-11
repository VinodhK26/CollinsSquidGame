# React client build
FROM node:18 AS client-build
WORKDIR /app
COPY SquidGameCollins.Client/package*.json ./SquidGameCollins.Client/
COPY SquidGameCollins.Client ./SquidGameCollins.Client/
WORKDIR /app/SquidGameCollins.Client
RUN npm install
RUN npm run build -- --mode production

# .NET server build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY . .
RUN mkdir -p SquidGameCollins.Server/wwwroot
COPY --from=client-build /app/SquidGameCollins.Client/dist SquidGameCollins.Server/wwwroot/
RUN dotnet publish SquidGameCollins.Server/SquidGameCollins.Server.csproj -c Release -o /out
