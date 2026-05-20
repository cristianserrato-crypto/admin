const TOKEN_KEY = 'cerbis_admin_token';
const D = 'di' + 'v';

const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const dateSelect = document.getElementById('date-select');
const statsRow = document.getElementById('stats-row');

function getToken() {
    return sessionStorage.getItem(TOKEN_KEY) || '';
}

function authHeaders() {
    return { Authorization: 'Bearer ' + getToken() };
}

async function api(path) {
    const res = await fetch(path, { headers: authHeaders() });
    if (res.status === 401) {
        logout();
        throw new Error('401');
    }
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    dashboardScreen.classList.remove('active');
    loginScreen.classList.add('active');
}

function esc(s) {
    const el = document.createElement('p');
    el.textContent = s == null ? '' : String(s);
    return el.innerHTML;
}

function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = document.getElementById('admin-token').value.trim();
    loginError.hidden = true;
    try {
        const res = await fetch('/admin/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        if (!res.ok) {
            loginError.textContent = 'Token incorrecto';
            loginError.hidden = false;
            return;
        }
        sessionStorage.setItem(TOKEN_KEY, token);
        loginScreen.classList.remove('active');
        dashboardScreen.classList.add('active');
        await loadDates();
        await loadDashboard();
    } catch {
        loginError.textContent = 'Error de conexion';
        loginError.hidden = false;
    }
});

document.getElementById('btn-logout').addEventListener('click', logout);
document.getElementById('btn-refresh').addEventListener('click', loadDashboard);

document.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
    });
});

dateSelect.addEventListener('change', loadDashboard);

function renderStats(summary) {
    statsRow.innerHTML = '';
    const cards = [
        ['Visitas', summary.total_visits],
        ['Mensajes', summary.total_messages],
        ['IPs unicas', summary.unique_ips],
        ['IPs con visita', summary.visit_ips],
    ];
    cards.forEach(([lbl, val]) => {
        const card = el(D, 'stat-card');
        card.appendChild(el(D, 'val', String(val)));
        card.appendChild(el(D, 'lbl', esc(lbl)));
        statsRow.appendChild(card);
    });
}

async function loadDates() {
    const dates = await api('/admin/api/dates');
    const current = dateSelect.value;
    dateSelect.innerHTML = '';
    dates.forEach((d) => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        dateSelect.appendChild(opt);
    });
    if (current && dates.includes(current)) dateSelect.value = current;
    else if (dates.length) dateSelect.value = dates[0];
}

function fillTable(tbodyId, rows, emptyColspan, emptyText) {
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = '';
    if (!rows.length) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="' + emptyColspan + '">' + emptyText + '</td>';
        tbody.appendChild(tr);
        return;
    }
    rows.forEach((cells) => {
        const tr = document.createElement('tr');
        cells.forEach((html) => {
            const td = document.createElement('td');
            td.innerHTML = html;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

async function loadDashboard() {
    const date = dateSelect.value;
    if (!date) return;

    const q = encodeURIComponent(date);
    const [summary, visits, convs] = await Promise.all([
        api('/admin/api/summary?date=' + q),
        api('/admin/api/visits?date=' + q),
        api('/admin/api/conversations?date=' + q),
    ]);

    renderStats(summary);

    fillTable(
        'visits-by-ip',
        visits.by_ip.map((r) => [
            '<span class="ip">' + esc(r.ip_address) + '</span>',
            String(r.visits),
            esc(r.first_at),
            esc(r.last_at),
        ]),
        4,
        'Sin visitas este dia'
    );

    const visitsDetail = document.getElementById('visits-detail');
    visitsDetail.innerHTML = '';
    if (!visits.items.length) {
        visitsDetail.appendChild(el(D, 'empty', 'Sin registros'));
    } else {
        visits.items.forEach((v) => {
            const item = el(D, 'visit-item');
            item.appendChild(el(D, 'visit-meta', esc(v.created_at) + ' &middot; <span class="ip">' + esc(v.ip_address) + '</span>'));
            item.appendChild(el(D, '', esc((v.user_agent || '').slice(0, 140))));
            visitsDetail.appendChild(item);
        });
    }

    fillTable(
        'convs-by-ip',
        convs.by_ip.map((r) => [
            '<span class="ip">' + esc(r.ip_address) + '</span>',
            String(r.messages),
            String(r.sessions != null ? r.sessions : '—'),
        ]),
        3,
        'Sin conversaciones'
    );

    const convsDetail = document.getElementById('convs-detail');
    convsDetail.innerHTML = '';
    if (!convs.items.length) {
        convsDetail.appendChild(el(D, 'empty', 'Sin mensajes'));
    } else {
        convs.items.forEach((m) => {
            const item = el(D, 'msg ' + (m.role === 'user' ? 'user' : 'model'));
            item.appendChild(el(D, 'msg-meta', esc(m.created_at) + ' &middot; <span class="ip">' + esc(m.client_ip || 'sin ip') + '</span> &middot; ' + esc(m.role)));
            item.appendChild(el(D, '', esc(m.content)));
            convsDetail.appendChild(item);
        });
    }
}

(async function init() {
    if (!getToken()) return;
    loginScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
    try {
        await loadDates();
        await loadDashboard();
    } catch {
        logout();
    }
})();
