# This function is for the extract the details from the pdf
import pypdf
from src.utills.apierror import ApiError

# Maximum page limit for the PDF file is 10
MAX_PAGE = 10

def extract_pdf_content(file) -> dict:
    try:
        pdf_read = pypdf.PdfReader(file)

        # collect a data from the pdf
        page_data = ""

        # length check for the page
        if len(pdf_read.pages) > MAX_PAGE:
            raise ApiError(400,f"PDF file is too large, maximum {MAX_PAGE} pages are allowed")

        for page in pdf_read.pages:
            text = page.extract_text()

            if not text:
                raise ApiError(400,"No text found in the PDF")
            else:
                line = ' '.join(text.split())
            

            # extra check for the unexpected words
            if not line:
                continue
            if "***************" in line:
                continue

            page_data += " " + line
        
        # find the Q.1 index and divide into 2 parts (1. header 2.paper_data)
        actual_data_index = page_data.find("Q.1")

        # check if the data is not found
        if actual_data_index == -1:
            return { "status":False,"error":"Not a valid paper pdf" }
        if not page_data:
            return {"status":False,"error":"No Page Data found"}

        # set data in the two part (1. header,2. paper_data)
        header_data = page_data[:actual_data_index]    
        actual_data = page_data[actual_data_index:]

        return { "status":True,"message":"Data extract successfully","header_data":header_data,
        "actual_data":actual_data }
    finally:
        pdf_read.stream.close() # close the stream after reading the pdf

