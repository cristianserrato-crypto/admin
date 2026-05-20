"""Registro y consultas de visitas / conversaciones por IP y fecha."""
import sqlite3
from datetime import datetime

DB_PATH = None
TZ_NAME = "America/Mexico_City"


def configure(db_path, tz_name=None):
    global DB_PATH, TZ_NAME
    DB_PATH = db_path
    if tz_name:
        TZ_NAME = tz_name


def _now_local():
    try:
        from zoneinfo import ZoneInfo
        return datetime.now(ZoneInfo(TZ_NAME))
    except Exception:
        return datetime.now()


def migrate_tables(conn):
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS page_visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        ip_address TEXT NOT NULL,
        path TEXT DEFAULT '/',
        user_agent TEXT,
        referer TEXT,
        visit_date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    c.execute('CREATE INDEX IF NOT EXISTS idx_visits_date ON page_visits(visit_date)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_visits_ip ON page_visits(ip_address)')
    for col, typedef in (
        ("client_ip", "TEXT"),
        ("session_id", "TEXT"),
    ):
        try:
            c.execute(f"ALTER TABLE conversations ADD COLUMN {col} {typedef}")
        except sqlite3.OperationalError:
            pass
    conn.commit()


def get_client_ip(request):
    """IP real detrás de Cloudflare / proxy."""
    cf = request.headers.get("CF-Connecting-IP", "").strip()
    if cf:
        return cf
    xff = request.headers.get("X-Forwarded-For", "").strip()
    if xff:
        return xff.split(",")[0].strip()
    xri = request.headers.get("X-Real-IP", "").strip()
    if xri:
        return xri
    return request.remote_addr or "desconocida"


def log_page_visit(request, session_id=None, path="/"):
    if not DB_PATH:
        return
    now = _now_local()
    visit_date = now.strftime("%Y-%m-%d")
    ip = get_client_ip(request)
    ua = (request.headers.get("User-Agent") or "")[:500]
    ref = (request.headers.get("Referer") or "")[:500]
    conn = sqlite3.connect(DB_PATH)
    migrate_tables(conn)
    c = conn.cursor()
    c.execute(
        """INSERT INTO page_visits (session_id, ip_address, path, user_agent, referer, visit_date)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (session_id, ip, path, ua, ref, visit_date),
    )
    conn.commit()
    conn.close()


def save_message_with_meta(profile_id, role, content, request, session_id=None):
    """Guarda mensaje con IP y sesión."""
    if not DB_PATH:
        return
    ip = get_client_ip(request)
    conn = sqlite3.connect(DB_PATH)
    migrate_tables(conn)
    c = conn.cursor()
    c.execute(
        """INSERT INTO conversations (profile_id, role, content, client_ip, session_id)
           VALUES (?, ?, ?, ?, ?)""",
        (profile_id, role, content, ip, session_id),
    )
    conn.commit()
    conn.close()


def query_dates_with_activity():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT DISTINCT visit_date FROM page_visits WHERE visit_date IS NOT NULL")
    d1 = {r[0] for r in c.fetchall()}
    c.execute("SELECT DISTINCT date(created_at) FROM conversations")
    d2 = {r[0] for r in c.fetchall() if r[0]}
    conn.close()
    dates = sorted(d1 | d2, reverse=True)
    if not dates:
        dates = [_now_local().strftime("%Y-%m-%d")]
    return dates


def query_visits_by_date(visit_date):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute(
        """SELECT id, session_id, ip_address, path, user_agent, referer, created_at
           FROM page_visits WHERE visit_date = ? ORDER BY created_at DESC""",
        (visit_date,),
    )
    rows = [dict(r) for r in c.fetchall()]
    c.execute(
        """SELECT ip_address, COUNT(*) AS visits, MIN(created_at) AS first_at, MAX(created_at) AS last_at
           FROM page_visits WHERE visit_date = ? GROUP BY ip_address ORDER BY visits DESC""",
        (visit_date,),
    )
    by_ip = [dict(r) for r in c.fetchall()]
    conn.close()
    return {"items": rows, "by_ip": by_ip, "total": len(rows)}


def query_conversations_by_date(visit_date):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute(
        """SELECT c.id, c.profile_id, c.role, c.content, c.client_ip, c.session_id, c.created_at,
                  p.name AS profile_name
           FROM conversations c
           LEFT JOIN profiles p ON p.id = c.profile_id
           WHERE date(c.created_at) = ?
           ORDER BY c.created_at ASC""",
        (visit_date,),
    )
    rows = [dict(r) for r in c.fetchall()]
    c.execute(
        """SELECT COALESCE(client_ip, 'sin ip') AS ip_address,
                  COUNT(*) AS messages,
                  COUNT(DISTINCT session_id) AS sessions
           FROM conversations
           WHERE date(created_at) = ?
           GROUP BY client_ip ORDER BY messages DESC""",
        (visit_date,),
    )
    by_ip = [dict(r) for r in c.fetchall()]
    conn.close()
    return {"items": rows, "by_ip": by_ip, "total": len(rows)}


def query_summary(visit_date):
    visits = query_visits_by_date(visit_date)
    convs = query_conversations_by_date(visit_date)
    unique_ips = len({v["ip_address"] for v in visits["by_ip"]} | {c["ip_address"] for c in convs["by_ip"]})
    return {
        "date": visit_date,
        "total_visits": visits["total"],
        "total_messages": convs["total"],
        "unique_ips": unique_ips,
        "visit_ips": len(visits["by_ip"]),
        "conversation_ips": len(convs["by_ip"]),
    }
