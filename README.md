# Spring Boot Hello World Project

This is a simple Java web project built with Spring Boot and Spring MVC.

## Project Structure

- `pom.xml`: Maven configuration file with necessary dependencies.
- `src/main/java/com/example/demo/DemoApplication.java`: The main entry point of the Spring Boot application.
- `src/main/java/com/example/demo/HelloController.java`: A simple REST controller that serves "Hello World" at the root path (`/`).
- `src/main/resources/application.properties`: Configuration file for the application.

## Prerequisites

- Java 17 or higher.
- A Java IDE (Spring Tool Suite, IntelliJ IDEA, or Eclipse).

## How to Import into STS (Spring Tool Suite)

1. **Export the Project**: Use the "Export to ZIP" option in AI Studio.
2. **Extract**: Unzip the folder on your local machine.
3. **Import**:
   - Open STS.
   - Go to `File > Import...`.
   - Select `Maven > Existing Maven Projects`.
   - Browse to the unzipped root directory (where `pom.xml` is located).
   - Click `Finish`.

## Running the Application

Once imported, right-click on the project in STS and select `Run As > Spring Boot App`.
The application will start on `http://localhost:8080`.
By visiting `http://localhost:8080`, you should see:
"Hello World from Spring Boot!"
