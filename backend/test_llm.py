from services.llm import LLM

llm = LLM()

context = """
Q1. Define OSI Model.

Q2. Define TCP/IP.

Q3. Explain Routing.
"""

question = "What is Routing?"

answer = llm.ask(context, question)

print(answer)