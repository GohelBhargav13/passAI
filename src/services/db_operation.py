from src.config.db_config import get_db_connection
from flask import request,jsonify

from src.utills.apierror import ApiError

# check the user is in the database or not
def check_user_in_db(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT user_id FROM users WHERE uuid = %s"
    cursor.execute(query, (user_id,))
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return result is not None

# define the function for save the response in database
def save_response_in_db(llm_response):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Assuming llm_response is a dictionary with keys 'header_details', 'questions', 'pass_strategy', and 'difficulty_paper'

    header = request.headers.get("Authorization")
    user_uuid = header.replace("Bearer ","") if header else None # this is the python ternary operator

    # check the current userId is in the database or not
    if not check_user_in_db(user_uuid):
        # insert a new user in the database with the header as uuid
        insert_user_query = "INSERT INTO users (uuid) VALUES (%s)"
        result = cursor.execute(insert_user_query,(user_uuid,))
        print(result)

    # insert the response in the database
    subject_name = llm_response["header_details"]["subject_name"]
    branch_name = llm_response["header_details"]["branch"]
    subject_code = llm_response["header_details"]["subject_code"]
    paper_year = llm_response["header_details"]["Date"]

    insert_paper_analysis = "" \
    "INSERT INTO user_history (uuid,university_name,subject_name,branch_name,subject_code,paper_year,result_json) VALUES (%s,%s,%s,%s,%s,%s,%s)"
    result = cursor.execute(insert_paper_analysis,(user_uuid,'GTU',subject_name,branch_name,subject_code,paper_year,jsonify(llm_response).get_data(as_text=True)))

    return { "status":True, "message":"Data inserted successfully in DB" }
