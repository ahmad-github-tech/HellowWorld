import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000;

// Preview Server for DGSL IT Support
// This replaces Thymeleaf logic with mock data for visual feedback in AI Studio.

function processTemplate(content: string, page: string, view: string = 'form') {
    const navLinks = [
        { href: '/', key: 'dashboard' },
        { href: '/tickets', key: 'tickets' },
        { href: '/config', key: 'config' }
    ];
    
    // 1. Navigation Active States
    navLinks.forEach(link => {
        const h = link.href === '/' ? '/' : link.href;
        // Match th:class="${page == 'key' ? 'active' : 'inactive'}"
        const regex = new RegExp(`href="${h}" th:class="\\\${page == '${link.key}' \\? '(.*?)' : '(.*?)'}"`, 'g');
        content = content.replace(regex, (match, active, inactive) => {
            const className = (link.key === page) ? active : inactive;
            return `href="${h}" class="${className}"`;
        });
    });

    // 2. View Visibility
    content = content.replace(/th:if="\${view == 'form'}"/g, view === 'form' ? '' : 'style="display:none"');
    content = content.replace(/th:if="\${view == 'details'}"/g, view === 'details' ? '' : 'style="display:none"');
    content = content.replace(/th:if="\${selectedProject\.id != null}"/g, '');
    content = content.replace(/th:if="\${selectedProject\.id == null or .*?}"/g, 'style="display:none"');

    // 3. Clean remaining Thymeleaf tags
    content = content.replace(/th:[a-z]+=".*?"/g, '');
    
    return content;
}

app.get('/', (req, res) => {
    const filePath = path.join(process.cwd(), 'src/main/resources/templates/dashboard.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Mock counts
    content = content.replace(/th:text="\${totalCount}"/g, '13');
    content = content.replace(/th:text="\${openCount}"/g, '4');
    
    const projectId = req.query.project || 'all';

    // Mock Project Selector
    const projectsHtml = `
        <option value="all" ${projectId === 'all' ? 'selected' : ''}>Global Meta</option>
        <option value="p1" ${projectId === 'p1' ? 'selected' : ''}>Axis Infrastructure</option>
        <option value="p2" ${projectId === 'p2' ? 'selected' : ''}>Tata Global Node</option>
        <option value="p3" ${projectId === 'p3' ? 'selected' : ''}>KAUST Core</option>
    `;
    content = content.replace(/<option th:each="p : \${projects}"(.|\n)*?<\/option>/, projectsHtml);

    res.send(processTemplate(content, 'dashboard'));
});

app.get('/tickets', (req, res) => {
    const filePath = path.join(process.cwd(), 'src/main/resources/templates/tickets.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    const tableRows = `
        <tr class="group hover:bg-slate-50/50 transition-all duration-300 border-b border-slate-100 last:border-0">
            <td class="px-8 py-6 mono text-[11px] font-medium text-slate-400 tracking-tighter">#T-1002</td>
            <td class="px-8 py-6">
                <div class="flex flex-col gap-1">
                    <div class="font-black text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">SSO Authentication Error</div>
                    <div class="text-[10px] font-medium text-slate-400 uppercase tracking-widest opacity-60">05 May 2026 14:10</div>
                </div>
            </td>
            <td class="px-8 py-6">
                <span class="text-[9px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-wider w-fit">Incident</span>
            </td>
            <td class="px-8 py-6">
                <span class="text-[11px] font-black text-slate-700 uppercase tracking-widest opacity-80">Axis Core</span>
            </td>
            <td class="px-8 py-6">
                <div class="flex">
                    <span class="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-red-50 text-red-600 border-red-100 shadow-sm shadow-red-100">Critical</span>
                </div>
            </td>
            <td class="px-8 py-6">
                <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full bg-indigo-600 animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.4)]"></div>
                    <span class="text-[11px] font-black text-slate-700 uppercase tracking-widest">Open</span>
                </div>
            </td>
            <td class="px-8 py-6 text-right">
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <a href="/tickets/new" class="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    </a>
                </div>
            </td>
        </tr>
    `;
    content = content.replace(/<tr th:each="t : \${tickets}"(.|\n)*?<\/tr>/, tableRows);
    
    res.send(processTemplate(content, 'tickets'));
});

app.get('/config', (req, res) => {
    const filePath = path.join(process.cwd(), 'src/main/resources/templates/config.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    const projectId = req.query.projectId;
    
    const projectsHtml = `
        <option value="p1" ${projectId === 'p1' ? 'selected' : ''}>Axis Infrastructure</option>
        <option value="p2" ${projectId === 'p2' ? 'selected' : ''}>Tata Global Node</option>
        <option value="p3" ${projectId === 'p3' ? 'selected' : ''}>KAUST Core</option>
    `;
    content = content.replace(/<option th:each="p : \${projects}"(.|\n)*?<\/option>/, projectsHtml);
    
    // Mock Selected Project Name
    let projectName = "AXIS INFRASTRUCTURE";
    if (projectId === 'p2') projectName = "TATA GLOBAL NODE";
    if (projectId === 'p3') projectName = "KAUST CORE";
    
    content = content.replace(/th:text="\${'Operational goals for ' \+ selectedProject\.name}"/g, `Operational goals for ${projectName}`);
    content = content.replace(/th:checked="\${selectedProject != null and p\.id == selectedProject\.id}"/g, ''); // Handled by manual injection if needed

    // Personnel List Replacement
    if (projectId) {
        const personnelHtml = `
            <div class="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                <div>
                    <div class="text-[11px] font-black text-slate-900 uppercase tracking-wider">Jamal Ahmad</div>
                    <div class="text-[9px] font-bold text-slate-400 uppercase">Principal Architect</div>
                </div>
                <div class="flex gap-2">
                    <span class="px-2 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black rounded uppercase">1 DOMAINS</span>
                </div>
            </div>
            <div class="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                <div>
                    <div class="text-[11px] font-black text-slate-900 uppercase tracking-wider">Sarah Connor</div>
                    <div class="text-[9px] font-bold text-slate-400 uppercase">SRE Lead</div>
                </div>
                <div class="flex gap-2">
                    <span class="px-2 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black rounded uppercase">1 DOMAINS</span>
                </div>
            </div>
        `;
        content = content.replace(/<div th:each="pers : \${personnelList}"(.|\n)*?<\/div>\n\s*?<\/div>/, personnelHtml + '</div>');
        content = content.replace(/th:if="\${not #lists\.isEmpty\(personnelList\)}"/g, '');
    } else {
        content = content.replace(/th:if="\${not #lists\.isEmpty\(personnelList\)}"/g, 'style="display:none"');
    }

    // Checkbox pre-checking in grid
    const projectGrid = `
        <div class="relative group">
            <label class="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-white hover:border-indigo-100 transition-all">
                <input type="checkbox" ${projectId === 'p1' ? 'checked' : ''} class="peer appearance-none w-6 h-6 rounded-lg border-2 border-slate-200 bg-white checked:bg-indigo-600">
                <span class="text-[11px] font-black text-slate-400 uppercase group-hover:text-slate-900">Axis Infrastructure</span>
            </label>
        </div>
        <div class="relative group">
            <label class="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-white hover:border-indigo-100 transition-all">
                <input type="checkbox" ${projectId === 'p2' ? 'checked' : ''} class="peer appearance-none w-6 h-6 rounded-lg border-2 border-slate-200 bg-white checked:bg-indigo-600">
                <span class="text-[11px] font-black text-slate-400 uppercase group-hover:text-slate-900">Tata Global Node</span>
            </label>
        </div>
        <div class="relative group">
            <label class="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-white hover:border-indigo-100 transition-all">
                <input type="checkbox" ${projectId === 'p3' ? 'checked' : ''} class="peer appearance-none w-6 h-6 rounded-lg border-2 border-slate-200 bg-white checked:bg-indigo-600">
                <span class="text-[11px] font-black text-slate-400 uppercase group-hover:text-slate-900">KAUST Core</span>
            </label>
        </div>
    `;
    content = content.replace(/<div th:each="p : \${projects}"(.|\n)*?<\/div>\n\s*?<\/div>/, projectGrid + '</div>');

    res.send(processTemplate(content, 'config', 'form'));
});

app.get('/tickets/new', (req, res) => {
    const filePath = path.join(process.cwd(), 'src/main/resources/templates/ticket-form.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    const projectsHtml = `
        <option value="p1">Axis Infrastructure</option>
        <option value="p2">Tata Global Node</option>
        <option value="p3">KAUST Core</option>
    `;
    content = content.replace(/<option th:each="p : \${projects}"(.|\n)*?<\/option>/, projectsHtml);
    content = content.replace(/th:text="\${ticket\.id == null \? 'New Entry' : 'Modify Record'}"/g, 'New Entry');
    
    res.send(processTemplate(content, 'tickets'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Preview server running on http://localhost:${PORT}`);
});
