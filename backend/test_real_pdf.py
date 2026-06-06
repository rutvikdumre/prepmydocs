import sys
sys.path.insert(0, r"C:\Projects\developmyai\backend")

from services.markitdown_service import convert_to_markdown
from services.token_counter import count_tokens

pdf_path = r"C:\Users\rutvi\Downloads\10.nov25.pdf"
with open(pdf_path, "rb") as f:
    file_bytes = f.read()

print(f"File size: {len(file_bytes):,} bytes")

try:
    md = convert_to_markdown(file_bytes, "test.pdf")
    before = count_tokens(file_bytes.decode("utf-8", errors="ignore"))
    after = count_tokens(md)
    print(f"tokens_before: {before}")
    print(f"tokens_after:  {after}")
    print(f"saved:         {before - after}")
    print(f"\nFirst 300 chars of markdown:\n{md[:300]}")
except Exception as e:
    print(f"CONVERSION ERROR: {type(e).__name__}: {e}")
