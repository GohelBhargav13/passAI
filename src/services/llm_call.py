import os
from groq import Groq
from dotenv import load_dotenv
from src.utills.apierror import ApiError

load_dotenv()

# Fail fast if API key is missing
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY is not set in environment variables")

client = Groq(api_key=api_key)


def call_llm_handler(header_data: str, paper_questions: str, user_prompt: str):

    # Validate inputs
    if not header_data or not header_data.strip():
        raise ApiError(400, "Header data is empty")
    if not paper_questions or not paper_questions.strip():
        raise ApiError(400, "Paper questions are empty")

    try:
        prompt = f"""
            You are an expert GTU (Gujarat Technological University) exam paper analyzer.

            Analyze the following GTU exam paper. For EACH question:
            1. Extract the exact question text
            2. Classify difficulty: EASY, MEDIUM, or HARD
            3. Give a brief answer in 4-5 lines
            4. Give two preparation tips
            5. How to pass this particular subject with a full roadmap
            6. If there are small programs (C, C++, Java, Python etc.), provide and explain them briefly

            If the user prompt is not empty, also consider it in your analysis.

            User Prompt: {user_prompt}

            Header data (extract subject details from this):
            {header_data}

            Respond ONLY in this exact JSON format, no extra text outside JSON:
            {{
                "user_prompt": {{
                    "is_prompt_provided": true or false,
                    "prompt": "{user_prompt}",
                    "prompt_analysis": "analysis as per user prompt, empty string if no prompt"
                }},
                "header_details": {{
                    "subject_name": "subject name from paper",
                    "branch": "for which branch",
                    "subject_code": "3160704",
                    "Date": "DD-MM-YYYY"
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
                "pass_strategy": "overall strategy to pass this exam",
                "difficulty_paper": "How difficult this paper is in (%)"
            }}

            EXAM PAPER:
            {paper_questions}
        """

        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant with deep knowledge of all GTU subjects. Always respond in valid JSON only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile", 
            temperature=0.2,
            max_tokens=6000                   
        )

        return {
            "status": True,
            "message": "Data fetched from LLM successfully",
            "final_output": response.choices[0].message.content
        }
    
    except Exception as e:
        raise ApiError(500, f"LLM call failed: {str(e)}")