import os
from groq import Groq
from dotenv import load_dotenv
from src.utills.apierror import ApiError

load_dotenv()

# make a Groq client 
client = Groq(api_key=os.getenv("GROQ_API_KEY",""))

# define the function that is call the LLM
def call_llm_handler(header_data:str,paper_questions:str,user_prompt:str):
        
        try:
         prompt = f"""
            You are an expert GTU (Gujarat Technological University) exam paper analyzer.

            Analyze the following GTU exam paper. For EACH question:
            1. Extract the exact question text
            2. Classify difficulty: EASY, MEDIUM, or HARD
            3. Give a brief answer in 4-5 lines
            4. Give two preparation tip
            5. How to pass this particular subject (Ex. TOC) with all possible roadmap
            6. if there is a small programs of any language like C, C++, Java, Python etc. then also provide the programs and explain the program in brief

            one more thing, if the user prompt is not empty then also consider the user prompt for the analysis and give a answer according to the user prompt.

            {user_prompt}

            Here is the separate part like header of the paper get the details and 
            respond ONLY in this excat JSON format for header, no extra text outside JSON:
            Header data:
            {header_data}

            Respond ONLY in this exact JSON format, no extra text outside JSON:
            {{
                "user_prompt":{{
                    "is_prompt_provided": true or false (user provide a prompt or not),
                    "prompt": "{user_prompt}",
                    "prompt_analysis":"provide the analysis of the paper as per the user prompt, only provide the theory in every paper, if the user prompt is empty than not need to provide the analysis for the user prompt"
                }}
                "header_details":{{
                        "subject_name":"subject name from paper",
                        "branch":"for which branch",
                        "subject_code":"3160704",
                        "Date":"DD-MM-YYYY"
                    }},
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
                "diffculty_paper":"How much difficult this particular paper with (%)"
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
                model="llama-3.1-8b-instant",
                temperature=0.2,
                max_tokens=3700
        )
         
        # returning a response to the other services
         return {"status":True,"message":"Data is fecth from the LLM","final_output":response.choices[0].message.content}
        
        except Exception as e:
            raise ApiError(500,str(e))
