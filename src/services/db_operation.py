from src.config.db_config import get_db_connection
from flask import json,jsonify
import logging,datetime
from src.utills.apierror import ApiError
from .encrypt_otp import encrypt_otp

# check the user is in the database or not
def check_user_in_db(cursor,user_email):
 
    query = "SELECT user_id FROM users WHERE user_email = %s"
    cursor.execute(query, (user_email,))
    return cursor.fetchone()

# define the function for save the response in database
def save_response_in_db(llm_response,user_email=None):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Assuming llm_response is a dictionary with keys 'header_details', 'questions', 'pass_strategy', and 'difficulty_paper'

    try:
        # check the current userId is in the database or not
        response = check_user_in_db(cursor,user_email)
        logging.info(f"User check response: {bool(response)}")

        if not response:
            # insert a new user in the database with the header as uuid
            insert_user_query = "INSERT INTO users (user_email) VALUES (%s)"
            cursor.execute(insert_user_query,(user_email,))
            conn.commit()

            if cursor.rowcount <= 0:
                raise ApiError(500,"Error while inserting the user in database")
            
            user_id = cursor.lastrowid
        else:
            user_id = response[0]

        print(llm_response)

        # insert the response in the database
        subject_name = llm_response["header_details"]["subject_name"]
        branch_name = llm_response["header_details"]["branch"]
        subject_code = llm_response["header_details"]["subject_code"]
        paper_year = llm_response["header_details"]["Date"]

        insert_paper_analysis = "" \
        "INSERT INTO user_history (user_id,university_name,subject_name,branch_name,subject_code,paper_year,result_json) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        cursor.execute(insert_paper_analysis,(
            user_id,'GTU',
            subject_name,branch_name,
            subject_code,paper_year,
            json.dumps(llm_response).strip()))
        conn.commit()

        if cursor.rowcount <= 0:
            raise ApiError(500,"Error while inserting the paper analysis in database")

        return { "status":True, "message":"Data inserted successfully in DB","data":cursor.lastrowid }
    
    finally :
        cursor.close()
        conn.close()

# find the user otp from the db
def find_user_otp(user_otp: str):
    conn = None   
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        if user_otp is None:
            raise ApiError(400, "User OTP is not found")

        encrypted_otp = encrypt_otp(user_otp)
        if encrypted_otp is None:
            raise ApiError(500, "Internal Error while encrypting OTP")

        # ✅ renamed query variable to avoid conflict with function name
        find_otp_query = "SELECT * FROM user_otp WHERE otp_number = %s AND otp_expiry > %s AND is_used = %s"
        cursor.execute(find_otp_query, (encrypted_otp, datetime.datetime.now(), "no"))

        # ✅ fetch ONCE and store in variable
        otp_row = cursor.fetchone()

        if otp_row is None:
            raise ApiError(404, "Invalid or expired OTP")

        otp_id = otp_row[0]
        user_id = otp_row[1] 

        update_otp_query = "DELETE FROM user_otp WHERE otp_id = %s AND is_used = %s"
        cursor.execute(update_otp_query, (int(otp_id),"no"))
        conn.commit()

        # find user details from the db
        find_user_by_id = "SELECT user_email from users WHERE user_id = %s"
        cursor.execute(find_user_by_id,(user_id,))

        user_email = cursor.fetchone()[0]

        if cursor.rowcount <= 0:
            raise ApiError(500, "Internal Error while updating OTP status")

        return { "status": True, "message": "OTP verified successfully", "otp_id": otp_id,"user_email":user_email }

    except ApiError as e:
        raise e

    except Exception as e:
        raise ApiError(500, str(e))

    finally:
        if cursor: cursor.close()
        if conn: conn.close()