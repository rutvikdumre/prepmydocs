import os
import tempfile
from markitdown import MarkItDown

md_converter = MarkItDown(enable_plugins=False)


def convert_to_markdown(file_bytes: bytes, filename: str) -> str:
    suffix = os.path.splitext(filename)[1] or ".tmp"

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        result = md_converter.convert(tmp_path)
        return result.text_content
    finally:
        os.unlink(tmp_path)
