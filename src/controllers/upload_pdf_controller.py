from flask import request,Blueprint,jsonify,json
from src.utills.apierror import ApiError
from src.services.check_file_ext import check_file_ext
from src.services.extract_content import extract_pdf_content
from src.services.llm_call import call_llm_handler
from src.utills.clean_response import llm_response_cleaner
from src.services.db_operation import save_response_in_db

# define the blue print of the analyze pdf
upload_pdf = Blueprint("upload_pdf",__name__)

# PDF upload routes 
@upload_pdf.route("/upload-pdf",methods=["POST"])
def get_paper_details():
    file = request.files.get("paper-pdf")
    user_prompt = request.form.get("userprompt")
    user_uuid = request.form.get("userId")

    # check if the file is not found
    if not file:
        raise ApiError(400,"File Not found")
    if file.filename == "":
        raise ApiError(400,"No file name is found")
    
    # check the file is follow the pdf rules
    if not check_file_ext(file.filename,file.content_type):
        raise ApiError(400,"Only PDF files are allowed")
    
    # call the extract content function
    extract_result = extract_pdf_content(file)

    if not extract_result.get("status"):
        raise ApiError(400,"error while extract the data from pdf")
    
    # Now calling a LLM for the paper response
    response_llm = call_llm_handler(extract_result["header_data"],extract_result["actual_data"],user_prompt)

    if not response_llm["status"]:
        raise ApiError(400,"Error from the LLM response")
        
    # clean the LLM response
    clean_response = llm_response_cleaner(response_llm["final_output"])
    if clean_response.strip():
        try:
             # try to load the response in json format
                clean_response = json.loads(clean_response)
        except Exception as e:
            raise ApiError(500,"Unable to load a response")
    else:
        raise ApiError(500,"LLM response is empty and not correct")

    # database call can be here for save the response in database
    db_status = save_response_in_db(clean_response,file,user_uuid)
    if not db_status["status"]:
        raise ApiError(500, "Failed to save response in database")

        # if the status is True than send a response to the client
    if db_status["status"]:
         return jsonify({ "statuscode":200,"message":"Full paper Analysis done successfully","final_response_data":clean_response })
        

    
    