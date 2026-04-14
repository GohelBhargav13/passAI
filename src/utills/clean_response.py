# Handler for cleaning the response getting from the LLM

def llm_response_cleaner(llm_response:str):
    llm_response = llm_response.replace("```","")
    return llm_response.strip()