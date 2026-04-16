# Handler for cleaning the response getting from the LLM

def llm_response_cleaner(llm_response:str):
    if llm_response.startswith("```") and llm_response.endswith("```") or llm_response.startswith("```json"):
        llm_response = llm_response.replace("```json","").replace("```","").strip()
        return llm_response
    return llm_response