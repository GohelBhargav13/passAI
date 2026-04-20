# Handler for cleaning the response getting from the LLM
from src.utills.apierror import ApiError

def llm_response_cleaner(llm_response:str):
    if not llm_response.strip():
        raise ApiError(500,"LLM response is empty")
    else:
        cleaned_response = llm_response.strip()
        cleaned_response = cleaned_response.replace("\n","")
        cleaned_response = cleaned_response.removeprefix("```json").removeprefix("```")
        cleaned_response = cleaned_response.removesuffix("```")
        return cleaned_response