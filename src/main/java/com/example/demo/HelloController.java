package com.example.demo;

import com.example.demo.model.Ticket;
import com.example.demo.model.Project;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class HelloController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @GetMapping("/")
    public String dashboard(@RequestParam(required = false, defaultValue = "all") String project, Model model) {
        List<Ticket> filteredTickets = project.equals("all") 
            ? ticketRepository.findAll()
            : ticketRepository.findByProjectId(project);

        List<Project> projects = projectRepository.findAll();

        model.addAttribute("tickets", filteredTickets);
        model.addAttribute("projects", projects);
        model.addAttribute("selectedProject", project);
        
        // Simple Stats
        long open = filteredTickets.stream().filter(t -> !"Resolved".equals(t.getStatus())).count();
        model.addAttribute("totalCount", filteredTickets.size());
        model.addAttribute("openCount", open);
        
        return "dashboard";
    }

    @GetMapping("/tickets")
    public String ticketList(Model model) {
        model.addAttribute("tickets", ticketRepository.findAll());
        model.addAttribute("projects", projectRepository.findAll());
        return "tickets";
    }

    @GetMapping("/tickets/new")
    public String showCreateForm(Model model) {
        Ticket newTicket = new Ticket();
        newTicket.setPriority("Low");
        newTicket.setStatus("Open");
        newTicket.setTicketType("Incident");
        newTicket.setTicketCategory("L1");
        model.addAttribute("ticket", newTicket);
        model.addAttribute("projects", projectRepository.findAll());
        return "ticket-form";
    }

    @PostMapping("/tickets/save")
    public String saveTicket(@ModelAttribute Ticket ticket) {
        ticketRepository.save(ticket);
        return "redirect:/tickets";
    }

    @GetMapping("/tickets/edit/{id}")
    public String editTicket(@PathVariable Long id, Model model) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        model.addAttribute("ticket", ticket);
        model.addAttribute("projects", projectRepository.findAll());
        return "ticket-form";
    }

    @GetMapping("/tickets/delete/{id}")
    public String deleteTicket(@PathVariable Long id) {
        ticketRepository.deleteById(id);
        return "redirect:/tickets";
    }

    @GetMapping("/config")
    public String config(Model model) {
        model.addAttribute("projects", projectRepository.findAll());
        return "config";
    }

    @PostMapping("/projects/save")
    public String saveProject(@ModelAttribute Project project) {
        projectRepository.save(project);
        return "redirect:/config";
    }
}
