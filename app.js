const API = 'http://localhost:3001/api/complaints';
let complaints = [];

async function load() {
    try {
        complaints = await (await fetch(API)).json();
        render();
    } catch (e) {
        document.getElementById('complaintsList').innerHTML = '<p style="color:red">Server Offline</p>';
    }
}

function render() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const cat = document.getElementById('filterCategory').value;
    
    const filtered = complaints.filter(c => 
        (c.residentName + c.roomNumber + c.description).toLowerCase().includes(search) &&
        (cat === 'All' || c.category === cat)
    );

    document.getElementById('complaintsList').innerHTML = filtered.map(c => `
        <div class="complaint-card">
            <h3>Room ${c.roomNumber} - ${c.priority} Priority</h3>
            <p><strong>${c.residentName}</strong> (${c.category}): ${c.description}</p>
            <span>${c.status} | ${new Date(c.date).toLocaleDateString()}</span>
        </div>
    `).join('');
}

document.getElementById('complaintForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        residentName: document.getElementById('residentName').value,
        roomNumber: document.getElementById('roomNumber').value,
        contactInfo: document.getElementById('contactInfo').value,
        category: document.getElementById('category').value,
        priority: document.getElementById('priority').value,
        description: document.getElementById('description').value,
        additionalInfo: document.getElementById('additionalInfo').value
    };
    const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) { alert('Submitted!'); document.getElementById('complaintForm').reset(); load(); }
});

document.getElementById('searchInput').addEventListener('input', render);
document.getElementById('filterCategory').addEventListener('change', render);
document.addEventListener('DOMContentLoaded', load);
