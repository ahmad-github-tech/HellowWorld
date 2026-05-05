import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000;

// This is a "Preview" server for AI Studio.
// The actual Java application logic is in src/main/java.
// This server simply renders the HTML templates for visual feedback.

app.get('/', (req, res) => {
    let filePath = path.join(process.cwd(), 'src/main/resources/templates/dashboard.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Simple mock "Thymeleaf" replacement for preview
    content = content.replace(/th:each="p : \${projects}"/g, '');
    content = content.replace(/th:text="\${p.name}"/g, 'Axis');
    content = content.replace(/th:value="\${p.id}"/g, 'p1');
    content = content.replace(/th:selected="\${p.id == selectedProject}"/g, '');
    
    // Add logic to handle the new Ticket form logic if needed (although sendFile is used for form)
    
    content = content.replace(/th:text="\${totalCount}"/g, '12');
    content = content.replace(/th:text="\${openCount}"/g, '4');
    
    // Mocking the table
    const tableRow = `
        <tr class="border-b last:border-0 hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4">
                <div class="font-bold text-slate-900">VPN Connectivity Issue</div>
                <div class="text-[10px] text-slate-400 truncate max-w-xs">Cannot reach US-EAST gateway for remote workers.</div>
            </td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-bold">High</span>
            </td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold">Open</span>
            </td>
        </tr>
    `;
    content = content.replace(/<tr th:each="t : \${tickets}"(.|\n)*?<\/tr>/, tableRow + tableRow.replace('VPN', 'Database').replace('High', 'Critical').replace('Open', 'In Progress'));

    res.send(content);
});

app.get('/tickets', (req, res) => {
    let filePath = path.join(process.cwd(), 'src/main/resources/templates/tickets.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Clean up th: each for preview
    content = content.replace(/<tr th:each="t : \${tickets}"(.|\n)*?<\/tr>/, `
        <tr class="border-b last:border-0 group hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4 text-slate-400 font-mono">#T-1002</td>
            <td class="px-6 py-4">
                <div class="font-bold">SSO Authentication Error</div>
                <div class="text-[10px] text-slate-400">05 May 2026 14:10</div>
            </td>
            <td class="px-6 py-4"><span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">Incident</span></td>
            <td class="px-6 py-4"><span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">L2</span></td>
            <td class="px-6 py-4 text-slate-500">Axis</td>
            <td class="px-6 py-4"><span class="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold">Critical</span></td>
            <td class="px-6 py-4"><span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold">Open</span></td>
            <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button class="text-indigo-600 font-bold">Edit</button>
                    <button class="text-red-600 font-bold">Delete</button>
                </div>
            </td>
        </tr>
    `);
    
    res.send(content);
});

app.get('/config', (req, res) => {
    let filePath = path.join(process.cwd(), 'src/main/resources/templates/config.html');
    res.sendFile(filePath);
});

app.get('/tickets/new', (req, res) => {
    let filePath = path.join(process.cwd(), 'src/main/resources/templates/ticket-form.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Mock projects for the dropdown
    const projectsHtml = `
        <option value="p1">Axis</option>
        <option value="p2">Tata Power</option>
        <option value="p3">KAUST</option>
    `;
    content = content.replace(/<option th:each="p : \${projects}"(.|\n)*?<\/option>/, projectsHtml);
    
    // Mock the auto-id logic
    content = content.replace(/th:value="\${\(ticket.id == null or ticket.id == ''\) \? 'TICKET-\(Auto\)' : '#' \+ ticket.id}"/g, 'value="TICKET-(Auto)"');
    content = content.replace(/th:text="\${ticket.id == null or ticket.id == '' \? 'Create New IT Ticket' : 'Update Ticket #' \+ ticket.id}"/g, 'Create New IT Ticket');
    
    // Clean up other th: attributes
    content = content.replace(/th:field=".*?"/g, '');
    content = content.replace(/th:action=".*?"/g, 'action="#"');
    content = content.replace(/th:object=".*?"/g, '');
    
    res.send(content);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Preview server running on http://localhost:${PORT}`);
});
