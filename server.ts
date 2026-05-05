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
    content = content.replace(/th:text="\${p.name}"/g, 'Cloud Migration');
    content = content.replace(/th:value="\${p.id}"/g, 'p1');
    content = content.replace(/th:selected="\${p.id == selectedProject}"/g, '');
    
    content = content.replace(/th:text="\${totalCount}"/g, '12');
    content = content.replace(/th:text="\${openCount}"/g, '4');
    
    // Mocking the table
    const tableRow = `
        <tr class="border-b last:border-0 hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4">
                <div class="font-bold text-slate-900">VPN Connectivity Issue</div>
                <div class="text-[10px] text-slate-400">Cannot reach US-EAST</div>
            </td>
            <td class="px-6 py-4">
                <span class="text-orange-600 font-bold">High</span>
            </td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold">Open</span>
            </td>
        </tr>
    `;
    content = content.replace(/<tr th:each="t : \${tickets}"(.|\n)*?<\/tr>/, tableRow + tableRow.replace('VPN', 'Database').replace('High', 'Critical').replace('Open', 'In Progress'));

    res.send(content);
});

app.get('/ticket-list', (req, res) => {
    let filePath = path.join(process.cwd(), 'src/main/resources/templates/ticket-list.html');
    res.sendFile(filePath);
});

app.get('/config', (req, res) => {
    let filePath = path.join(process.cwd(), 'src/main/resources/templates/config.html');
    res.sendFile(filePath);
});

app.get('/tickets/new', (req, res) => {
    let filePath = path.join(process.cwd(), 'src/main/resources/templates/ticket-form.html');
    res.sendFile(filePath);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Preview server running on http://localhost:${PORT}`);
});
