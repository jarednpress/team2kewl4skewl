[![Github Repository](src/img/logo.png)](https://github.com/jarednpress/team2kewl4skewl.git)
# Meteor Melodies Mapper

Presented by Team 2Kewl4Skewl
(*CSCI-3308-Recitation-15-Team-02*)

## Description

Meteor Melodies Mapper offers a unique way to prepare a playlist for any roadtrip. By taking in the origin and destination, provided by the user, our app web app will process that data to determine the weather at each point then generate a playlist suited to the mood of the weather along the route.

## Contributors

* `Emma Worthington:` EmmaWorthington235
* `Evan Rodenburg:` Evan-jpg-pdf
* `Francisco Villanueva:` cisconueva
* `Jared Press:` jarednpress
* `Jonathan Wu:` jonathancsci

## Tech Stack
In the process of creating Meteor Melodies Mapper, the following technologies were utilized:
1. GitHub
2. PostgreSQL
3. Visual Studio Code
4. UI
    - HTML
    - EJS
    - Bootstrap
    - GoodNotes
    - JavaScript
5. NodeJS
6. Microsoft Azure
7. External APIs
    - Google Maps
    - Open Weather
    - Spotify
8. Docker
9. Lucidchart

## Prerequisites
The code is all self-contained and should not require any additonal additional software with the exception of Docker Desktop and an editor such as Visual Studio Code when running locally. Note, API keys for Google Maps, Open Weather Map, and Spotify are required to properly the application.
## Step-by-step for LocalHost
1. Clone the repo to a local environment
2. Open Docker Desktop (https://www.docker.com/products/docker-desktop/)
3. Open an editor such as Visual Studio Code (https://code.visualstudio.com/download)
4. If using Visual Studio Code, open the builtin terminal
5. Boot Docker using the following command:
    - *docker-compose up*
6. Open a web browser and type *localhost:3000* to access application
7. Once done accessing the application, in the terminal, terminate the session with ctrl-c and enter the following command to wind down Docker:
    - *docker-compose down*
## Testing
The test cases have been implemented under `./tests` and will run automatically upon running the application. No additional input is required to perform tests unless the user is manually testing features.
## Link
http://recitation-015-team-02.eastus.cloudapp.azure.com:3000/welcome
