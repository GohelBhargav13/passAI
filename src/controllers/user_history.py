from flask import request,Blueprint,jsonify
from src.utills.apierror import ApiError
from src.config.db_config import get_db_connection

# define the blue print of the user history
user_history = Blueprint("user_history",__name__)

# find the user from the database
# check the user is in the database or not
def check_user_in_db(user_uuid):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = "SELECT user_id FROM users WHERE uuid = %s"
        cursor.execute(query, (user_uuid,))
        result = cursor.fetchone()

        print("user found",result)
        cursor.close()
        conn.close()

        return result
    
    except Exception as e:
        raise ApiError(500,str(e))

@user_history.route("/history/<uuid>",methods=["GET"])
def fetch_user_histroy(uuid):
    try:

        conn = get_db_connection()
        cursor = conn.cursor()

        if uuid is None:
            raise ApiError(400,"User uuid is not provided")
        
        # find the user is in the db not 
        result = check_user_in_db(uuid)

        # if user is not found
        if not result:
            raise ApiError(404,"User not found")
        
        # find the user paper analysis history using a join

        find_user_history = "SELECT uh.h_id AS h_id,uh.university_name AS university_name,uh.subject_name AS subject_name,uh.branch_name AS branch_name,uh.subject_code AS subject_code,uh.paper_year AS paper_year,uh.search_time AS search_time,uh.paper_name AS paper_name FROM user_history uh JOIN users u ON u.user_id = uh.user_id WHERE u.uuid = %s "
        cursor.execute(find_user_history,(uuid,))
        user_result = cursor.fetchall()

        if len(user_result) <= 0 :
            raise ApiError(400,"No records are found")
        
        # convert the user result in list of dictionary (list comprehension)
        user_result = [ { "h_id": row[0], "university_name": row[1], "subject_name": row[2], "branch_name": row[3], "subject_code": row[4], "paper_year": row[5], "search_time": row[6], "paper_name": row[7] } for row in user_result if row is not None ]

        return { "status":True, "data":user_result, "message":"History fetched successfully" }
    
    except Exception as e:
        raise ApiError(500,str(e))

# find the user history details by h_id
@user_history.route("/history/details/<h_id>",methods=["GET"])
def fetch_user_history_details(h_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        find_history_details = "SELECT result_json FROM user_history WHERE h_id = %s"
        cursor.execute(find_history_details,(h_id,))
        history_details = cursor.fetchone()

        if not history_details:
            raise ApiError(404,"History details not found")
        
        # close the cursor and connection
        cursor.close()
        conn.close()

        return { "status":True, "data":{ "paper_response": history_details[0] }, "message":"History details fetched successfully" }
    
    except Exception as e:
        raise ApiError(500,str(e))
    
