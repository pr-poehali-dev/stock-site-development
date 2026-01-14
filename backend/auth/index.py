"""
API для авторизации и регистрации пользователей
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body = json.loads(event.get('body', '{}'))
    action = body.get('action')
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        if action == 'register':
            return register_user(conn, body)
        elif action == 'login':
            return login_user(conn, body)
        elif action == 'update_profile':
            return update_profile(conn, body)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'}),
                'isBase64Encoded': False
            }
    finally:
        conn.close()

def register_user(conn, body):
    email = body.get('email')
    name = body.get('name')
    
    if not email or not name:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email and name are required'}),
            'isBase64Encoded': False
        }
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    existing = cursor.fetchone()
    
    if existing:
        return {
            'statusCode': 409,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User already exists'}),
            'isBase64Encoded': False
        }
    
    role = 'admin' if email == 'admin@zidesign.com' else 'user'
    avatar = f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}"
    
    cursor.execute(
        """
        INSERT INTO users (email, name, avatar, role) 
        VALUES (%s, %s, %s, %s) 
        RETURNING id, email, name, avatar, bio, role, created_at
        """,
        (email, name, avatar, role)
    )
    
    user = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'user': dict(user),
            'message': 'User registered successfully'
        }, default=str),
        'isBase64Encoded': False
    }

def login_user(conn, body):
    email = body.get('email')
    
    if not email:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email is required'}),
            'isBase64Encoded': False
        }
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        "SELECT id, email, name, avatar, bio, role, created_at FROM users WHERE email = %s",
        (email,)
    )
    
    user = cursor.fetchone()
    cursor.close()
    
    if not user:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User not found'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'user': dict(user)}, default=str),
        'isBase64Encoded': False
    }

def update_profile(conn, body):
    user_id = body.get('user_id')
    name = body.get('name')
    bio = body.get('bio')
    avatar = body.get('avatar')
    
    if not user_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User ID is required'}),
            'isBase64Encoded': False
        }
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute(
        """
        UPDATE users 
        SET name = COALESCE(%s, name),
            bio = COALESCE(%s, bio),
            avatar = COALESCE(%s, avatar),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
        RETURNING id, email, name, avatar, bio, role, created_at
        """,
        (name, bio, avatar, user_id)
    )
    
    user = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    if not user:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User not found'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'user': dict(user)}, default=str),
        'isBase64Encoded': False
    }
