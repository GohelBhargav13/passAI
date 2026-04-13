from flask import request,Blueprint,jsonify
from src.utills.apierror import ApiError
from src.services.check_file_ext import check_file_ext
from src.services.extract_content import extract_pdf_content

# define the blue print of the analyze pdf
upload_pdf = Blueprint("upload_pdf",__name__)

# PDF upload routes 
@upload_pdf.route("/upload-pdf",methods=["POST"])
def get_paper_details():
    file = request.files.get("paper-pdf")

    # check if the file is not found
    if not file:
        raise ApiError(400,"File Not found")
    if file.filename == " ":
        raise ApiError(400,"No file name is found")
    
    # check the file is follow the pdf rules
    if not check_file_ext(file.filename,file.content_type):
        raise ApiError(400,"Only PDF files are allowed")
    
    # call the extract content function
    extract_result = extract_pdf_content(file)

    if not extract_result.get("status"):
        raise ApiError(400,"error while extract the data from pdf")
    
    return jsonify({ "statuscode":200,"message":"data extract from pdf","data":extract_result["actual_data"] })

    
    