from services.pdf_loader import PDFLoader
from services.splitter import TextSplitter

loader = PDFLoader()

text = loader.extract_text("sample_question_paper.pdf")

print(text[:1000])

splitter = TextSplitter()

chunks = splitter.split(text)

print()

print("Chunks :", len(chunks))