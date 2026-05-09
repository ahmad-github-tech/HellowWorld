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

    @Autowired
    private com.example.demo.repository.PersonnelRepository personnelRepository;

    @GetMapping("/")
    public String dashboard(@RequestParam(required = false, defaultValue = "all") String project, Model model) {
        List<Ticket> filteredTickets;
        if ("all".equals(project)) {
            filteredTickets = ticketRepository.findAll();
        } else {
            try {
                filteredTickets = ticketRepository.findByProjectId(Long.parseLong(project));
            } catch (NumberFormatException e) {
                filteredTickets = ticketRepository.findAll();
            }
        }

        List<Project> projects = projectRepository.findAll();

        model.addAttribute("tickets", filteredTickets);
        model.addAttribute("projects", projects);
        model.addAttribute("selectedProject", project);
        model.addAttribute("page", "dashboard");
        
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
        model.addAttribute("page", "tickets");
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
    public String config(@RequestParam(required = false) Long projectId, Model model) {
        List<Project> projects = projectRepository.findAll();
        Project selected = null;
        
        if (projectId != null) {
            final Long id = projectId;
            selected = projects.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst()
                .orElse(null);
        }
        
        if (selected == null || selected.getId() == null) {
            if (selected == null) selected = new Project();
            selected.setBusinessHours("24/7");
            selected.setTimezone("UTC");
            selected.setP1Response(2); selected.setP1Resolution(4);
            selected.setP2Response(4); selected.setP2Resolution(8);
            selected.setP3Response(8); selected.setP3Resolution(24);
            selected.setP4Response(24); selected.setP4Resolution(48);
        }
        
        model.addAttribute("projects", projects);
        if (projectId != null) {
            model.addAttribute("personnelList", personnelRepository.findByProjects_Id(projectId));
        } else {
            model.addAttribute("personnelList", personnelRepository.findAll());
        }
        model.addAttribute("selectedProject", selected);
        model.addAttribute("newPersonnel", new com.example.demo.model.Personnel());
        model.addAttribute("view", "form");
        model.addAttribute("page", "config");
        return "config";
    }

    @GetMapping("/config-details")
    public String configDetails(Model model) {
        model.addAttribute("projects", projectRepository.findAll());
        model.addAttribute("personnelList", personnelRepository.findAll());
        model.addAttribute("view", "details");
        model.addAttribute("page", "details");
        return "config";
    }

    @PostMapping("/projects/save")
    public String saveProject(@ModelAttribute Project project) {
        Project saved = projectRepository.save(project);
        return "redirect:/config?projectId=" + saved.getId();
    }

    @GetMapping("/projects/delete/{id}")
    public String deleteProject(@PathVariable Long id) {
        projectRepository.deleteById(id);
        return "redirect:/config";
    }

    @PostMapping("/personnel/save")
    public String savePersonnel(@ModelAttribute com.example.demo.model.Personnel personnel, 
                                @RequestParam(required = false) List<Long> projectIds,
                                @RequestParam(required = false) Long currentProjectId) {
        if (projectIds != null) {
            List<Project> projects = projectRepository.findAllById(projectIds);
            personnel.getProjects().clear();
            personnel.getProjects().addAll(projects);
        }
        personnelRepository.save(personnel);
        if (currentProjectId != null) {
            return "redirect:/config?projectId=" + currentProjectId;
        }
        return "redirect:/config";
    }
}
