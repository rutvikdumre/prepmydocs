import os
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.markitdown_service import convert_to_markdown
from services.token_counter import count_tokens
from models.schemas import ConvertResponse

router = APIRouter()

SUPPORTED_EXTENSIONS = {
    ".pdf", ".docx", ".pptx", ".xlsx", ".xls",
    ".html", ".htm", ".csv", ".json", ".xml",
    ".txt", ".md", ".zip", ".jpg", ".jpeg",
    ".png", ".mp3", ".wav"
}


async def _process_file(file: UploadFile) -> ConvertResponse:
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in SUPPORTED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext} ({file.filename})")

    file_bytes = await file.read()
    raw_text = file_bytes.decode("utf-8", errors="ignore")
    tokens_before = count_tokens(raw_text)

    try:
        markdown = convert_to_markdown(file_bytes, file.filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed for {file.filename}: {str(e)}")

    tokens_after = count_tokens(markdown)
    tokens_saved = max(0, tokens_before - tokens_after)
    savings_pct = round((tokens_saved / tokens_before) * 100) if tokens_before > 0 else 0
    base_name = file.filename.rsplit(".", 1)[0] if "." in file.filename else file.filename

    return ConvertResponse(
        markdown=markdown,
        filename=base_name + ".md",
        tokens_before=tokens_before,
        tokens_after=tokens_after,
        tokens_saved=tokens_saved,
        savings_percent=savings_pct,
    )


@router.post("/convert", response_model=List[ConvertResponse])
async def convert_files(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    return [await _process_file(f) for f in files]
