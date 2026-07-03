document.addEventListener('DOMContentLoaded', function () {
    // ---- NAVIGATION LINKS (show/hide sections) ----
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = {
        dashboard: document.getElementById('dashboard'),
        patients: document.getElementById('patients'),
        doctors: document.getElementById('doctors'),
        appointments: document.getElementById('appointments'),
        reports: document.getElementById('reports')
    };

    function showSection(sectionId) {
        // hide all sections
        Object.keys(sections).forEach(key => {
            if (sections[key]) sections[key].style.display = 'none';
        });
        // show selected
        if (sections[sectionId]) sections[sectionId].style.display = 'block';
        // update active nav
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const sectionId = href.replace('#', '');
            if (sectionId && sections[sectionId]) {
                showSection(sectionId);
            }
            // close hamburger menu
            document.getElementById('navLinks').classList.remove('open');
        });
    });

    // show dashboard by default
    showSection('dashboard');

    // ---- HAMBURGER MENU ----
    document.getElementById('hamburger').addEventListener('click', function () {
        document.getElementById('navLinks').classList.toggle('open');
    });

    // ---- MODAL (New Patient) ----
    const modal = document.getElementById('patientModal');
    const newPatientBtn = document.getElementById('newPatientBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    function openModal() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    newPatientBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    // ---- SUBMIT NEW PATIENT (demo) ----
    const patientForm = document.getElementById('patientForm');
    patientForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('patientName').value.trim();
        if (!name) {
            alert('Please enter patient name.');
            return;
        }
        // Build new row (demo)
        const tbody = document.getElementById('patientTableBody');
        const row = document.createElement('tr');
        const date = new Date().toISOString().slice(0,10);
        row.innerHTML = `
            <td><span class="patient-avatar"><i class="fas fa-user"></i></span> ${name}</td>
            <td>P-${Math.floor(1000 + Math.random() * 9000)}</td>
            <td>Dr. Assigned</td>
            <td><span class="badge warning">New</span></td>
            <td>${date}</td>
            <td><button class="btn-icon"><i class="fas fa-ellipsis-v"></i></button></td>
        `;
        tbody.prepend(row);
        closeModal();
        patientForm.reset();
        // update total patients stat (demo)
        const totalEl = document.getElementById('totalPatients');
        let current = parseInt(totalEl.textContent.replace(/,/g, ''));
        if (!isNaN(current)) {
            current += 1;
            totalEl.textContent = current.toLocaleString();
        }
    });

    // ---- GLOBAL SEARCH (simple filter) ----
    const searchInput = document.getElementById('globalSearch');
    searchInput.addEventListener('input', function () {
        const filter = this.value.toLowerCase();
        const rows = document.querySelectorAll('#patientTableBody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(filter) ? '' : 'none';
        });
    });

    // ---- LOAD PATIENTS FROM API (demo) ----
    async function loadPatients() {
        try {
            const res = await fetch('/api/patients');
            const data = await res.json();
            const tbody = document.getElementById('patientTableBody');
            tbody.innerHTML = '';
            data.forEach(p => {
                const statusClass = p.status.toLowerCase().includes('critical') ? 'danger' :
                                    p.status.toLowerCase().includes('treatment') ? 'warning' :
                                    p.status.toLowerCase().includes('discharged') ? 'success' : 'success';
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><span class="patient-avatar"><i class="fas fa-user"></i></span> ${p.name}</td>
                    <td>${p.id}</td>
                    <td>${p.doctor}</td>
                    <td><span class="badge ${statusClass}">${p.status}</span></td>
                    <td>${p.last_visit}</td>
                    <td><button class="btn-icon"><i class="fas fa-ellipsis-v"></i></button></td>
                `;
                tbody.appendChild(row);
            });
        } catch (err) {
            // fallback: static rows already in HTML
            console.log('API not available, using static data');
        }
    }
    loadPatients();
});
