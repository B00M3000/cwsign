import os
import json
import pymysql
import logging
from datetime import date

log_level = os.environ.get("LOG_LEVEL", "INFO").upper()
logger = logging.getLogger()
logger.setLevel(log_level)

db_host = os.environ.get("DB_HOST")
db_user = os.environ.get("DB_USER")
db_password = os.environ.get("DB_PASSWORD")
db_name = os.environ.get("DB_NAME")

missing_vars = [var for var in ("DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME") if not os.environ.get(var)]
if missing_vars:
    raise ValueError(f"FATAL ERROR: Missing required environment variables: {', '.join(missing_vars)}")

try:
    conn = pymysql.connect(host=db_host, user=db_user, passwd=db_password, db=db_name, connect_timeout=5)
except pymysql.MySQLError as e:
    logger.error("ERROR: Could not connect to MySQL instance during initialization.", exc_info=True)
    conn = None

def _build_response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(body)
    }

def handler(event, context):
    logger.info(f"POST /response invoked with event: {json.dumps(event)}")

    if conn is None:
        logger.error("Database connection is not available.")
        return _build_response(500, {"error": "Internal server error: Database connection failed."})

    try:
        body = json.loads(event.get('body', '{}'))
        response_text = body.get('response')

        if not response_text or not isinstance(response_text, str) or len(response_text.strip()) == 0:
            return _build_response(400, {"error": "The 'response' field is required and cannot be empty."})
        
        today_date = date.today().isoformat()
        with conn.cursor() as cursor:
            cursor.execute("SELECT id FROM questions WHERE question_date = %s", (today_date,))
            question_result = cursor.fetchone()

            if not question_result:
                return _build_response(404, {"error": "Cannot submit response: No question found for today."})

            question_id = question_result[0]
            insert_sql = "INSERT INTO responses (question_id, response_text) VALUES (%s, %s)" #inserts
            cursor.execute(insert_sql, (question_id, response_text.strip()))
            response_id = cursor.lastrowid
            conn.commit()
            
        return _build_response(201, {"message": "Response submitted successfully.", "response_id": response_id})
    except json.JSONDecodeError:
        return _build_response(400, {"error": "Invalid JSON format in request body."})
    except Exception as e:
        logger.error("An unexpected error occurred in post_response.handler.", exc_info=True)
        return _build_response(500, {"error": "An unexpected internal server error occurred."})