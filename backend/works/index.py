"""
API для управления работами (создание, модерация, получение)
"""
import json
import os
import base64
import psycopg2
from psycopg2.extras import RealDictCursor
import boto3

def handler(event, context):
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'GET':
            return get_works(conn, event)
        elif method == 'POST':
            return create_work(conn, event)
        elif method == 'PUT':
            return update_work(conn, event)
        elif method == 'DELETE':
            return delete_work(conn, event)
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    finally:
        conn.close()

def get_works(conn, event):
    params = event.get('queryStringParameters', {}) or {}
    status = params.get('status')
    category = params.get('category')
    author_id = params.get('author_id')
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    query = """
        SELECT w.*, u.name as author_name, u.avatar as author_avatar
        FROM works w
        JOIN users u ON w.author_id = u.id
        WHERE 1=1
    """
    query_params = []
    
    if status:
        query += " AND w.status = %s"
        query_params.append(status)
    
    if category:
        query += " AND w.category = %s"
        query_params.append(category)
    
    if author_id:
        query += " AND w.author_id = %s"
        query_params.append(int(author_id))
    
    query += " ORDER BY w.created_at DESC"
    
    cursor.execute(query, query_params)
    works = cursor.fetchall()
    cursor.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'works': [dict(w) for w in works]}, default=str),
        'isBase64Encoded': False
    }

def create_work(conn, event):
    body = json.loads(event.get('body', '{}'))
    
    title = body.get('title')
    description = body.get('description')
    category = body.get('category')
    license_type = body.get('license')
    tags = body.get('tags', [])
    author_id = body.get('author_id')
    image_base64 = body.get('image_base64')
    author_role = body.get('author_role', 'user')
    
    if not all([title, category, license_type, author_id, image_base64]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing required fields'}),
            'isBase64Encoded': False
        }
    
    s3 = boto3.client('s3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )
    
    import uuid
    image_data = base64.b64decode(image_base64.split(',')[1] if ',' in image_base64 else image_base64)
    image_key = f"works/{author_id}/{title.replace(' ', '_')}_{uuid.uuid4().hex[:8]}.jpg"
    
    s3.put_object(
        Bucket='files',
        Key=image_key,
        Body=image_data,
        ContentType='image/jpeg'
    )
    
    image_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{image_key}"
    
    status = 'approved' if author_role == 'admin' else 'pending'
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        """
        INSERT INTO works (title, description, category, image_url, license, tags, author_id, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id, title, description, category, image_url, license, tags, author_id, status, likes, downloads, created_at
        """,
        (title, description, category, image_url, license_type, tags, author_id, status)
    )
    
    work = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'work': dict(work), 'message': 'Work created successfully'}, default=str),
        'isBase64Encoded': False
    }

def update_work(conn, event):
    body = json.loads(event.get('body', '{}'))
    work_id = body.get('work_id')
    status = body.get('status')
    
    if not work_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Work ID is required'}),
            'isBase64Encoded': False
        }
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if status:
        cursor.execute(
            "UPDATE works SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *",
            (status, work_id)
        )
    else:
        cursor.execute("SELECT * FROM works WHERE id = %s", (work_id,))
    
    work = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    if not work:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Work not found'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'work': dict(work)}, default=str),
        'isBase64Encoded': False
    }

def delete_work(conn, event):
    params = event.get('queryStringParameters', {}) or {}
    work_id = params.get('id')
    
    if not work_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Work ID is required'}),
            'isBase64Encoded': False
        }
    
    cursor = conn.cursor()
    cursor.execute("DELETE FROM works WHERE id = %s RETURNING id", (work_id,))
    deleted = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    if not deleted:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Work not found'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'message': 'Work deleted successfully'}),
        'isBase64Encoded': False
    }