import fitz


class PDFLoader:

    def __init__(self):
        pass

    def extract_text(self, pdf_path):

        document = fitz.open(pdf_path)

        text = ""

        for page_number, page in enumerate(document):

            page_text = page.get_text()

            text += f"\n\n----- PAGE {page_number + 1} -----\n"

            text += page_text

        document.close()

        return text

    def get_page_count(self, pdf_path):

        document = fitz.open(pdf_path)

        pages = len(document)

        document.close()

        return pages

    def get_metadata(self, pdf_path):

        document = fitz.open(pdf_path)

        metadata = document.metadata

        document.close()

        return metadata