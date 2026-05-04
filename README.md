# Nexus IT Support System (Spring Boot + Spring MVC)

This is a pure Java web application designed to run entirely within **Spring Tool Suite (STS)**. It uses server-side rendering with Thymeleaf and Spring MVC.

## Key Features
- **Smart Dashboard**: Filtered metrics by project and priority.
- **Ticket Lifecycle**: Full CRUD operations for service tickets.
- **Configuration Module**: Onboard projects and manage SLA benchmarks.
- **Thymeleaf UI**: Server-side rendering using Spring MVC and Thymeleaf.
- **Tailwind Aesthetic**: Modern, responsive design using CDN-based Tailwind CSS.

## Project Structure
- `pom.xml`: Maven configuration (Spring Boot 3.2.5 + Web + Thymeleaf).
- `src/main/java/com/example/demo/HelloController.java`: The main Spring MVC controller handling all routing and data logic.
- `src/main/resources/templates/`: Pure HTML templates using Thymeleaf syntax.
- `src/main/java/com/example/demo/model/`: Java POJOs for Tickets and Projects.

## How to use in Spring Tool Suite (STS)
1. **Export**: Use the **Settings > Export to ZIP** option in AI Studio.
2. **Extract**: Unzip the project folder on your machine.
3. **Import**:
   - Open STS.
   - `File > Import... > Maven > Existing Maven Projects`.
   - Select the unzipped folder.
4. **Run**:
   - Right-click the project in Project Explorer.
   - `Run As > Spring Boot App`.
5. **Access**: Open `http://localhost:8080` in your browser.

*Note: This project does **not** require Node.js or npm. It is a 100% Java Maven project.*
