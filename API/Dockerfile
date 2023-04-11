FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /app
EXPOSE 8080

# copy the csproj and restore as distict or different layers
COPY *.csproj ./
RUN dotnet restore

#copt everything else and then build
COPY . ./
RUN dotnet publish -c Release -o out

#building a runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT [ "dotnet","API.dll" ]