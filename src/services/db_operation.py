from src.config.db_config import get_db_connection
from flask import request,json
import logging

from src.utills.apierror import ApiError

# check the user is in the database or not
def check_user_in_db(cursor,user_uuid):
 
    query = "SELECT user_id FROM users WHERE uuid = %s"
    cursor.execute(query, (user_uuid,))
    return cursor.fetchone()

# define the function for save the response in database
def save_response_in_db(llm_response,paper_pdf,user_uuid):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Assuming llm_response is a dictionary with keys 'header_details', 'questions', 'pass_strategy', and 'difficulty_paper'

    try:
        # check the current userId is in the database or not
        response = check_user_in_db(cursor,user_uuid)
        logging.info(f"User check response: {bool(response)}")

        if not response:
            # insert a new user in the database with the header as uuid
            insert_user_query = "INSERT INTO users (uuid) VALUES (%s)"
            cursor.execute(insert_user_query,(user_uuid,))
            conn.commit()

            if cursor.rowcount <= 0:
                raise ApiError(500,"Error while inserting the user in database")
            
            user_id = cursor.lastrowid
        else:
            user_id = response[0]

        # insert the response in the database
        subject_name = llm_response["header_details"]["subject_name"]
        branch_name = llm_response["header_details"]["branch"]
        subject_code = llm_response["header_details"]["subject_code"]
        paper_year = llm_response["header_details"]["Date"]

        insert_paper_analysis = "" \
        "INSERT INTO user_history (user_id,university_name,subject_name,branch_name,subject_code,paper_year,result_json,paper_name) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"
        cursor.execute(insert_paper_analysis,(
            user_id,'GTU',
            subject_name,branch_name,
            subject_code,paper_year,
            json.dumps(llm_response).strip(),paper_pdf.filename))
        conn.commit()

        if cursor.rowcount <= 0:
            raise ApiError(500,"Error while inserting the paper analysis in database")

        return { "status":True, "message":"Data inserted successfully in DB" }
    
    finally :
        cursor.close()
        conn.close()
