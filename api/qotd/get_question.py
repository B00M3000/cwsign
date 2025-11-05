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
    logger.info(f"GET /question invoked with event: {json.dumps(event)}")
    
    if conn is None:
        logger.error("Database connection is not available.")
        return _build_response(500, {"error": "Internal server error: Database connection failed."})

    try:
        today_date = date.today().isoformat()
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT id, question_text, question_date FROM questions WHERE question_date = %s", (today_date,))
            result = cursor.fetchone()

        if result:
            result['question_date'] = result['question_date'].isoformat()
            return _build_response(200, result)
        else:
            return _build_response(404, {"message": f"No question found for date: {today_date}"})
    except Exception as e:
        logger.error("An unexpected error occurred in get_question.handler.", exc_info=True)
        return _build_response(500, {"error": "An unexpected internal server error occurred."})