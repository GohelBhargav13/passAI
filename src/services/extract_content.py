# This function is for the extract the details from the pdf
import pypdf

def extract_pdf_content(file) -> dict:
    pdf_read = pypdf.PdfReader(file)

    # collect a data from the pdf
    page_data = ""
    for page in pdf_read.pages:
        line = ' '.join(page.extract_text().strip())

        # extra check for the unexpected words
        if not line:
            continue
        if "***************" in line:
            continue

        page_data += line
    
    # find the Q.1 index and divide into 2 parts (1. header 2.paper_data)
    actual_data_index = page_data.find("Q.1")

    # check if the data is not found
    if actual_data_index == -1:
        return { "status":False,"error":"No Questions found" }
    if not page_data:
        return {"status":False,"error":"No Page Data found"}

    # set data in the two part (1. header,2. paper_data)
    header_data = page_data[:actual_data_index]    
    actual_data = page_data[actual_data_index:]

    return { "status":True,"message":"Data extract successfully","header_data":header_data,"actual_data":actual_data }

