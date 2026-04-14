import os
from groq import Groq
from dotenv import load_dotenv
from src.utills.apierror import ApiError

load_dotenv()

# make a Groq client 
client = Groq(api_key=os.getenv("GROQ_API_KEY",""))

# define the function that is call the LLM
def call_llm_handler(header_data:str,paper_questions:str):
        
        try:
         prompt = f"""
            You are an expert GTU (Gujarat Technological University) exam paper analyzer.

            Analyze the following GTU exam paper. For EACH question:
            1. Extract the exact question text
            2. Classify difficulty: EASY, MEDIUM, or HARD
            3. Give a brief answer in 2-3 lines
            4. Give one preparation tip
            5. How to pass this particular subject (Ex. TOC) with all possible roadmap

            Here is the separate part like header of the paper get the details and 
            respond ONLY in this excat JSON format for header, no extra text outside JSON:
            {{
                "header_details":{{
                    "subject_name":"subject name from paper",
                    "branch":"for which branch",
                    "subject_code":"3160704",
                    "Date":"DD-MM-YYYY"
                }}
            }}

            Header data:
            {header_data}

            Respond ONLY in this exact JSON format, no extra text outside JSON:
            {{
                "questions": [
                    {{
                        "id": 1,
                        "question": "exact question text",
                        "marks": 3,
                        "difficulty": "EASY",
                        "reason": "why this difficulty",
                        "brief_answer": "answer here",
                        "prep_tip": "how to prepare"
                    }}
                ],
                "pass_strategy": "overall strategy to pass this exam"
                "diffculty_paper(%)":"How much difficult this particular paper with (%)"
            }}

            EXAM PAPER:
            {paper_questions}
        """
        
        # LLM calling with client system role
         response = client.chat.completions.create(
                messages=[
                    {
                        "role":"system",
                        "content":"You are a helpful assistant.You have a knowledge about All GTU subjects and also you master i teaching that's why you provide a good response"
                    },
                    {
                        "role":"user",
                        "content":prompt
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.2,
                max_tokens=3700
        )
         
        # returning a response to the other services
         return {"status":True,"message":"Data is fecth from the LLM","final_output":response.choices[0].message.content}
        
        except Exception as e:
            raise ApiError(500,str(e))
