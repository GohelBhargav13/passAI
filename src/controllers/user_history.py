from flask import Blueprint,request,jsonify
from src.services.send_mail_by_api import send_email_api
from src.utills.apierror import ApiError
from src.config.db_config import get_db_connection
from src.services.db_operation import check_user_in_db
from src.services.generate_otp import generate_otp_code
from src.services.generate_email_template import generate_email_template
from src.services.encrypt_otp import encrypt_otp
from src.services.db_operation import find_user_otp
from src.services.db_operation import save_response_in_db
from src.services.db_operation import check_user_in_db
from datetime import datetime,timedelta

# define the blue print of the user history
user_history = Blueprint("user_history",__name__)

# find the user from the database
# check the user is in the database or not
# def check_user_in_db(cursor,user_uuid):
#     if not user_uuid:
#         raise ApiError(400,"User uuid is not provided")
#     try:
#         query = "SELECT user_id FROM users WHERE uuid = %s"
#         cursor.execute(query, (user_uuid,))
#         return cursor.fetchone()
    
#     except Exception as e:
#         raise ApiError(500,str(e))

conn = None
cursor = None
@user_history.route("/history",methods=["POST"])
def fetch_user_histroy():
    try:

        conn = get_db_connection()
        cursor = conn.cursor()

        response_body = request.get_json()

        if response_body is None:
            raise ApiError(404,"Response not found")
        user_email = response_body["user_email"]

        if user_email is None:
            raise ApiError(404,"User email is not found")
        
        # find the user is in the db not 
        result = check_user_in_db(cursor,user_email)

        # if user is not found
        if not result:
            raise ApiError(404,"Details not found for the user")
        
        # find the user paper analysis history using a join

        find_user_history = "SELECT uh.h_id AS h_id,uh.university_name AS university_name,uh.subject_name AS subject_name,uh.branch_name AS branch_name,uh.subject_code AS subject_code,uh.paper_year AS paper_year,uh.search_time AS search_time FROM user_history uh JOIN users u ON u.user_id = uh.user_id WHERE u.user_email = %s "
        cursor.execute(find_user_history,(user_email,))
        user_result = cursor.fetchall()

        if len(user_result) <= 0 :
            raise ApiError(400,"No records are found")
        
        # convert the user result in list of dictionary (list comprehension)
        user_result = [ { "h_id": row[0], "university_name": row[1], "subject_name": row[2], "branch_name": row[3], "subject_code": row[4], "paper_year": row[5], "search_time": row[6] } for row in user_result ]

        return { "status":True, "data":user_result, "message":"History fetched successfully" }
    finally:
        if cursor : cursor.close()
        if conn :conn.close()

# find the user history details by h_id
@user_history.route("/history/details/<int:h_id>",methods=["GET"])
def fetch_user_history_details(h_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        find_history_details = "SELECT result_json FROM user_history WHERE h_id = %s"
        cursor.execute(find_history_details,(h_id,))
        history_details = cursor.fetchone()

        if not history_details:
            raise ApiError(404,"History details not found")
    
        return { "status":True, "data":{ "paper_response": history_details[0] }, "message":"History details fetched successfully" }
    
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# user response save in database
@user_history.route("/history/save-response", methods=["POST"])
def save_user_response_db():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        body_response = request.get_json()
        user_email = body_response.get("email")

        if not user_email:
            raise ApiError(404, "User Email is not found")

        is_userExists = check_user_in_db(cursor, user_email)

        if not is_userExists:
            # new user → insert
            insert_user_query = "INSERT INTO users (user_email) VALUES (%s)"
            cursor.execute(insert_user_query, (user_email,))
            conn.commit()

            if cursor.rowcount <= 0:
                raise ApiError(500, "Error while inserting user in database")

            user_id = cursor.lastrowid

        else:
            # existing user → just get user_id
            user_id = is_userExists[0]

        # OTP logic runs for BOTH new and existing users
        user_otp = generate_otp_code()
        if user_otp is None:
            raise ApiError(500, "Internal Error while generating OTP")

        encrypted_user_otp = encrypt_otp(user_otp)
        if encrypted_user_otp is None:
            raise ApiError(500, "Internal error while encrypting OTP")

        insert_otp_query = "INSERT INTO user_otp (user_id, otp_number, otp_expiry) VALUES (%s,%s,%s)"
        cursor.execute(insert_otp_query, (user_id, encrypted_user_otp, datetime.now() + timedelta(minutes=10)))
        conn.commit()

        if cursor.rowcount <= 0:
            raise ApiError(500, "Internal error inserting OTP record")

        email_result = send_email_api(user_email, generate_email_template(user_otp))

        if email_result["status"]:
            return jsonify({ "status": True, "message": "OTP sent successfully to your email" })
        else:
            raise ApiError(500, "Failed to send OTP email")

    except ApiError as e:
        return jsonify({ "status": False, "message": e.message }), e.statuscode

    except Exception as e:
        return jsonify({ "status": False, "message": str(e) }), 500

    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# user verify otp function
@user_history.route("/verify-otp",methods=["POST"])
def verify_user_otp():
    try:
        conn = None
        cursor = None
        # get a otp from the form

        body_response = request.get_json()
        user_otp = body_response.get("user_otp")

        if user_otp is None:
            raise ApiError(404,"OTP is not found")
        
        # find the otp from the db
        is_matched = find_user_otp(user_otp)

        if not is_matched["status"]:
            raise ApiError(400,"OTP is not matched")
        
        return jsonify({ "status":True,"message": is_matched["message"], "user_email":is_matched["user_email"] })
    
    except ApiError as e:
        return jsonify({ "status": False, "message": e.message }), e.statuscode

    except Exception as e:
        return jsonify({ "status": False, "message": str(e) }), 500

    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# save user response in the in the database
@user_history.route("/save/user-response",methods=["POST"])
def save_user_response_final():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        response_body = request.get_json()

        if response_body is None:
            raise ApiError(400,"Paper reposne is not found")
                
        user_paper_analysis = response_body["user_paper_response"]
        user_email = response_body["user_email"]

        print("response body: ", response_body)
        # save the response to the DB
        db_response = save_response_in_db(user_paper_analysis,user_email)

        if not db_response["status"]:
            raise ApiError(500,"Internal Error while inserting a data")

        return { "status": db_response["status"], "message": db_response["message"], "history_id":db_response["data"] }

    finally:
        if cursor : cursor.close()
        if conn : conn.close()

# resend user OTP
@user_history.route("/resend-otp",methods=["POST"])
def resend_user_otp():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
    
        body_response = request.get_json()

        if body_response is None:
            raise ApiError(400,"user response is not found")
        user_email = body_response.get("useremail")

        if user_email is None:
            raise ApiError(404,"Email not found")
        
        # generate otp
        user_otp = generate_otp_code()
        if user_otp is None:
            raise ApiError(500, "Internal Error while generating OTP")
        
        encrypted_user_otp = encrypt_otp(user_otp)
        if encrypted_user_otp is None:
            raise ApiError(500, "Internal error while encrypting OTP")
        
        # find user in the database
        db_response = check_user_in_db(cursor,user_email)

        if db_response is None:
            raise ApiError(400,"User not found")
        
        insert_otp_query = "INSERT INTO user_otp (user_id, otp_number, otp_expiry) VALUES (%s,%s,%s)"
        cursor.execute(insert_otp_query, (db_response[0], encrypted_user_otp, datetime.now() + timedelta(minutes=10)))
        conn.commit()

        # send mail to the user
        mail_response = send_email_api(user_email,generate_email_template(user_otp),"Your New OTP Code")
        
        if mail_response["status"] is None:
            raise ApiError(500,"Internal error while sending a email")
        
        return { "status":True, "message":mail_response["message"] }
    finally:
        if cursor : cursor.close()
        if conn : conn.close()

# delete user history from the database
@user_history.route("/history-delete/<int:hid>",methods=["GET"])
def delete_user_history(hid):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        if not hid:
            raise ApiError(404,"Unable to load history")
        
        if hid is None:
            raise ApiError(404,"No History found")
        
        # call the db to delete the history
        delete_paper_history = "DELETE FROM user_history WHERE h_id = %s"
        cursor.execute(delete_paper_history,(int(hid),))
        conn.commit()

        if cursor.rowcount <= 0:
            raise ApiError(500, "Internal error while deleting a history")
        
        # send the response to frontend history deleted
        return jsonify({ "status":True, "message":"History deleted successfully", "history_id":hid })

    except ApiError as e:
        raise e
    finally:
        if conn : conn.close()
        if cursor : cursor.close()
