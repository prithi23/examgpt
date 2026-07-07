from services.pdf_loader import PDFLoader
from services.splitter import TextSplitter
from services.llm import LLM


class RAG:

    def __init__(self):

        self.loader = PDFLoader()
        self.splitter = TextSplitter()
        self.llm = LLM()

        self.chunks = []

    def process_pdf(self, pdf_path):

        print("Reading PDF...")

        text = self.loader.extract_text(pdf_path)

        print("Splitting PDF...")

        self.chunks = self.splitter.split_text(text)

        return len(self.chunks)

    def retrieve(self, question):

        question_words = question.lower().split()

        scores = []

        for chunk in self.chunks:

            score = 0

            lower_chunk = chunk.lower()

            for word in question_words:

                if word in lower_chunk:
                    score += 1

            scores.append((score, chunk))

        scores.sort(reverse=True)

        best_chunks = []

        for score, chunk in scores[:3]:

            if score > 0:
                best_chunks.append(chunk)

        if len(best_chunks) == 0:
            best_chunks = self.chunks[:3]

        return best_chunks

    def ask(self, question):

        docs = self.retrieve(question)

        context = "\n\n".join(docs)

        answer = self.llm.ask(context, question)

        return {
            "question": question,
            "answer": answer,
            "source": docs
        }