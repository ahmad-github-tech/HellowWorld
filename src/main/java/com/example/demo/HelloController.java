package com.example.demo;

import com.example.demo.model.Ticket;
import com.example.demo.model.Project;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;

@Controller
public class HelloController {

    private static List<Project> projects = new ArrayList<>(Arrays.asList(
        new Project("p1", "Cloud Migration", "Enterprise AWS move", 24),
        new Project("p2", "Internal HR Portal", "Staff payroll system", 48),
        new Project("p3", "Legacy ERP Support", "SAP maintenance", 12)
    ));

    private static List<Ticket> tickets = new ArrayList<>(Arrays.asList(
        new Ticket("t1", "VPN Connectivity Issue", "Cannot reach US-EAST", "p1", "High", "Open"),
        new Ticket("t2", "Payroll Calculation Bug", "Mismatch in bonuses", "p2", "Critical", "In Progress"),
        new Ticket("t3", "UI Glitch in Portal", "Icons not displaying", "p2", "Low", "Resolved")
    ));

    @GetMapping("/")
    public String dashboard(@RequestParam(required = false, defaultValue = "all") String project, Model model) {
        List<Ticket> filteredTickets = project.equals("all") 
            ? tickets 
            : tickets.stream().filter(t -> t.getProjectId().equals(project)).collect(Collectors.toList());

        model.addAttribute("tickets", filteredTickets);
        model.addAttribute("projects", projects);
        model.addAttribute("selectedProject", project);
        
        // Simple Stats
        long open = filteredTickets.stream().filter(t -> !t.getStatus().equals("Resolved")).count();
        model.addAttribute("totalCount", filteredTickets.size());
        model.addAttribute("openCount", open);
        
        return "dashboard";
    }

    @GetMapping("/ticket-list")
    public String ticketList(Model model) {
        model.addAttribute("tickets", tickets);
        model.addAttribute("projects", projects);
        return "ticket-list";
    }

    @GetMapping("/tickets/new")
    public String showCreateForm(Model model) {
        model.addAttribute("ticket", new Ticket("", "", "", "", "Low", "Open"));
        model.addAttribute("projects", projects);
        return "ticket-form";
    }

    @PostMapping("/tickets/save")
    public String saveTicket(@ModelAttribute Ticket ticket) {
        if (ticket.getId() == null || ticket.getId().isEmpty()) {
            ticket.setId("t" + (tickets.size() + 1));
            tickets.add(ticket);
        } else {
            for (int i = 0; i < tickets.size(); i++) {
                if (tickets.get(i).getId().equals(ticket.getId())) {
                    tickets.set(i, ticket);
                    break;
                }
            }
        }
        return "redirect:/ticket-list";
    }

    @GetMapping("/tickets/edit/{id}")
    public String editTicket(@PathVariable String id, Model model) {
        Ticket ticket = tickets.stream().filter(t -> t.getId().equals(id)).findFirst().orElse(null);
        model.addAttribute("ticket", ticket);
        model.addAttribute("projects", projects);
        return "ticket-form";
    }

    @GetMapping("/tickets/delete/{id}")
    public String deleteTicket(@PathVariable String id) {
        tickets.removeIf(t -> t.getId().equals(id));
        return "redirect:/ticket-list";
    }

    @GetMapping("/config")
    public String config(Model model) {
        model.addAttribute("projects", projects);
        return "config";
    }

    @PostMapping("/projects/save")
    public String saveProject(@ModelAttribute Project project) {
        project.setId("p" + (projects.size() + 1));
        projects.add(project);
        return "redirect:/config";
    }
}
