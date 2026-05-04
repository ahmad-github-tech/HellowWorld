package com.example.demo;

import com.example.demo.model.Ticket;
import com.example.demo.model.Project;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/api")
public class HelloController {

    private List<Project> projects = Arrays.asList(
        new Project("p1", "Cloud Migration", "Enterprise AWS move", 24),
        new Project("p2", "Internal HR Portal", "Staff payroll system", 48)
    );

    private List<Ticket> tickets = new ArrayList<>(Arrays.asList(
        new Ticket("t1", "VPN Connectivity Issue", "Cannot reach US-EAST", "p1", "High", "Open"),
        new Ticket("t2", "Payroll Calculation Bug", "Mismatch in bonuses", "p2", "Critical", "In Progress")
    ));

    @GetMapping("/tickets")
    public List<Ticket> getTickets() {
        return tickets;
    }

    @GetMapping("/projects")
    public List<Project> getProjects() {
        return projects;
    }

    @PostMapping("/tickets")
    public Ticket createTicket(@RequestBody Ticket ticket) {
        ticket.setId("t" + (tickets.size() + 1));
        tickets.add(ticket);
        return ticket;
    }

    @DeleteMapping("/tickets/{id}")
    public String deleteTicket(@PathVariable String id) {
        tickets.removeIf(t -> t.getId().equals(id));
        return "Ticket " + id + " purged successfully.";
    }
}
