import os
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


class LLM:

    def __init__(self):
        self.url = "https://openrouter.ai/api/v1/chat/completions"

        self.headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost",
            "X-Title": "ExamGPT"
        }

    def ask(self, context, question):

        prompt = f"""
You are ExamGPT.

The following text was extracted from an uploaded PDF.

Your job is to answer ONLY using the provided PDF content.

If the answer is not found in the PDF, reply exactly:

"I couldn't find the answer in the uploaded PDF."

---------------- PDF CONTENT ----------------

{context}

--------------------------------------------

Question:
{question}

Answer:
"""

        data = {
            "model": "meta-llama/llama-3.1-8b-instruct",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful assistant that answers questions only from the uploaded PDF."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.2,
            "max_tokens": 500
        }

        try:

            response = requests.post(
                self.url,
                headers=self.headers,
                json=data,
                timeout=60
            )

            response.raise_for_status()

            result = response.json()

            return result["choices"][0]["message"]["content"]

        except requests.exceptions.RequestException as e:
            return f"OpenRouter API Error: {str(e)}"

        except Exception as e:
            return f"Unexpected Error: {str(e)}"