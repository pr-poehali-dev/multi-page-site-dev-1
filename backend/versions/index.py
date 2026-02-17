"""CRUD API для управления версиями/новостями документации."""
import os
import json
import jwt
import psycopg2


JWT_SECRET = os.environ.get('JWT_SECRET')
JWT_ALGORITHM = 'HS256'


def get_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)


def get_schema():
    schema = os.environ.get('MAIN_DB_SCHEMA', '')
    return f"{schema}." if schema else ""


def escape(value):
    if value is None:
        return 'NULL'
    if isinstance(value, bool):
        return 'TRUE' if value else 'FALSE'
    if isinstance(value, (int, float)):
        return str(value)
    s = str(value).replace("'", "''")
    return f"'{s}'"


def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json'
    }


def respond(status, body):
    return {
        'statusCode': status,
        'headers': cors_headers(),
        'body': json.dumps(body, default=str, ensure_ascii=False)
    }


def get_user_from_token(event):
    headers = event.get('headers', {})
    auth = headers.get('X-Authorization') or headers.get('x-authorization') or headers.get('Authorization') or headers.get('authorization') or ''
    if not auth.startswith('Bearer '):
        return None
    token = auth[7:]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get('type') != 'access':
            return None
        s = get_schema()
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(f"SELECT id, email, name, user_role FROM {s}users WHERE id = {int(payload['sub'])}")
        row = cur.fetchone()
        cur.close()
        conn.close()
        if not row:
            return None
        return {'id': row[0], 'email': row[1], 'name': row[2], 'role': row[3]}
    except Exception:
        return None


def is_editor(user):
    return user and user.get('role') in ('admin', 'moderator')


def list_versions():
    s = get_schema()
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(f"""
        SELECT v.id, v.version, v.date, v.type, v.title, v.description,
               v.full_description, v.changes, v.files, v.author_id,
               v.created_at, v.updated_at, u.name, u.email
        FROM {s}versions v
        LEFT JOIN {s}users u ON v.author_id = u.id
        ORDER BY v.date DESC, v.id DESC
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    result = []
    for r in rows:
        result.append({
            'id': r[0],
            'version': r[1],
            'date': r[2],
            'type': r[3],
            'title': r[4],
            'description': r[5],
            'fullDescription': r[6],
            'changes': r[7] if r[7] else [],
            'files': r[8] if r[8] else [],
            'authorId': r[9],
            'createdAt': r[10],
            'updatedAt': r[11],
            'authorName': r[12] or r[13]
        })
    return respond(200, result)


def get_version(version_id):
    s = get_schema()
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(f"""
        SELECT v.id, v.version, v.date, v.type, v.title, v.description,
               v.full_description, v.changes, v.files, v.author_id,
               v.created_at, v.updated_at, u.name, u.email
        FROM {s}versions v
        LEFT JOIN {s}users u ON v.author_id = u.id
        WHERE v.id = {int(version_id)}
    """)
    r = cur.fetchone()
    cur.close()
    conn.close()

    if not r:
        return respond(404, {'error': 'Версия не найдена'})

    return respond(200, {
        'id': r[0],
        'version': r[1],
        'date': r[2],
        'type': r[3],
        'title': r[4],
        'description': r[5],
        'fullDescription': r[6],
        'changes': r[7] if r[7] else [],
        'files': r[8] if r[8] else [],
        'authorId': r[9],
        'createdAt': r[10],
        'updatedAt': r[11],
        'authorName': r[12] or r[13]
    })


def create_version(event, user):
    body = json.loads(event.get('body', '{}'))
    version = body.get('version', '').strip()
    date = body.get('date', '').strip()
    vtype = body.get('type', '').strip()
    title = body.get('title', '').strip()
    description = body.get('description', '').strip()
    full_description = body.get('fullDescription', '').strip() or None
    changes = body.get('changes', [])
    files = body.get('files', [])

    if not all([version, date, vtype, title, description]):
        return respond(400, {'error': 'Заполните обязательные поля: version, date, type, title, description'})
    if vtype not in ('major', 'minor', 'patch'):
        return respond(400, {'error': 'Тип должен быть major, minor или patch'})

    changes_sql = "ARRAY[" + ",".join(escape(c) for c in changes) + "]" if changes else "ARRAY[]::text[]"
    files_json = json.dumps(files, ensure_ascii=False).replace("'", "''")

    s = get_schema()
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(f"""
        INSERT INTO {s}versions (version, date, type, title, description, full_description, changes, files, author_id)
        VALUES ({escape(version)}, {escape(date)}, {escape(vtype)}, {escape(title)}, {escape(description)},
                {escape(full_description)}, {changes_sql}, '{files_json}'::jsonb, {user['id']})
        RETURNING id
    """)
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return respond(201, {'id': new_id, 'message': 'Версия создана'})


def update_version(event, user, version_id):
    body = json.loads(event.get('body', '{}'))
    s = get_schema()

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT id FROM {s}versions WHERE id = {int(version_id)}")
    if not cur.fetchone():
        cur.close()
        conn.close()
        return respond(404, {'error': 'Версия не найдена'})

    sets = []
    if 'version' in body:
        sets.append(f"version = {escape(body['version'].strip())}")
    if 'date' in body:
        sets.append(f"date = {escape(body['date'].strip())}")
    if 'type' in body:
        vtype = body['type'].strip()
        if vtype not in ('major', 'minor', 'patch'):
            cur.close()
            conn.close()
            return respond(400, {'error': 'Тип должен быть major, minor или patch'})
        sets.append(f"type = {escape(vtype)}")
    if 'title' in body:
        sets.append(f"title = {escape(body['title'].strip())}")
    if 'description' in body:
        sets.append(f"description = {escape(body['description'].strip())}")
    if 'fullDescription' in body:
        sets.append(f"full_description = {escape(body['fullDescription'].strip() if body['fullDescription'] else None)}")
    if 'changes' in body:
        changes = body['changes']
        changes_sql = "ARRAY[" + ",".join(escape(c) for c in changes) + "]" if changes else "ARRAY[]::text[]"
        sets.append(f"changes = {changes_sql}")
    if 'files' in body:
        files_json = json.dumps(body['files'], ensure_ascii=False).replace("'", "''")
        sets.append(f"files = '{files_json}'::jsonb")

    if not sets:
        cur.close()
        conn.close()
        return respond(400, {'error': 'Нет данных для обновления'})

    sets.append("updated_at = CURRENT_TIMESTAMP")
    cur.execute(f"UPDATE {s}versions SET {', '.join(sets)} WHERE id = {int(version_id)}")
    conn.commit()
    cur.close()
    conn.close()

    return respond(200, {'message': 'Версия обновлена'})


def delete_version(version_id):
    s = get_schema()
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT id FROM {s}versions WHERE id = {int(version_id)}")
    if not cur.fetchone():
        cur.close()
        conn.close()
        return respond(404, {'error': 'Версия не найдена'})

    cur.execute(f"DELETE FROM {s}versions WHERE id = {int(version_id)}")
    conn.commit()
    cur.close()
    conn.close()

    return respond(200, {'message': 'Версия удалена'})


def handler(event, context):
    """API для управления версиями документации. GET — список/детали, POST/PUT/DELETE — для админов и модераторов."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers(),
            'body': ''
        }

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    version_id = params.get('id')

    if method == 'GET':
        if version_id:
            return get_version(version_id)
        return list_versions()

    user = get_user_from_token(event)
    if not is_editor(user):
        return respond(403, {'error': 'Доступ запрещён. Требуется роль администратора или модератора'})

    if method == 'POST':
        return create_version(event, user)
    elif method == 'PUT':
        if not version_id:
            return respond(400, {'error': 'Укажите id версии'})
        return update_version(event, user, version_id)
    elif method == 'DELETE':
        if not version_id:
            return respond(400, {'error': 'Укажите id версии'})
        return delete_version(version_id)

    return respond(405, {'error': 'Метод не поддерживается'})
