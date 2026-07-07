from fastapi import APIRouter, UploadFile, File
import os
import shutil

from services.rag import RAG

router = APIRouter()

rag = RAG()


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    os.makedirs("uploads", exist_ok=True)

    file_path = os.path.join("uploads", file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    chunks = rag.process_pdf(file_path)

    return {
        "success": True,
        "filename": file.filename,
        "chunks": chunks,
        "message": "PDF uploaded successfully."
    }
