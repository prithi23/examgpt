from services.rag import RAG

rag = RAG()

rag.process_pdf("sample_question_paper.pdf")

result = rag.ask("Explain Routing")

print("\nQUESTION\n")
print(result["question"])

print("\nANSWER\n")
print(result["answer"])

print("\nSOURCE\n")

for chunk in result["source"]:
    print("----------------")
    print(chunk)