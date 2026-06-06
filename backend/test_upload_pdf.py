import urllib.request
import urllib.error
import json

pdf_path = r"C:\Users\rutvi\Downloads\10.nov25.pdf"
with open(pdf_path, "rb") as f:
    file_bytes = f.read()

boundary = "boundary456"
filename = "10.nov25.pdf"

body = (
    b"--" + boundary.encode() + b"\r\n"
    b'Content-Disposition: form-data; name="file"; filename="10.nov25.pdf"\r\n'
    b"Content-Type: application/pdf\r\n\r\n"
    + file_bytes
    + b"\r\n--" + boundary.encode() + b"--\r\n"
)

req = urllib.request.Request(
    "http://localhost:8000/convert",
    data=body,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    method="POST",
)

try:
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read().decode())
        print(f"filename:        {data['filename']}")
        print(f"tokens_before:   {data['tokens_before']:,}")
        print(f"tokens_after:    {data['tokens_after']:,}")
        print(f"tokens_saved:    {data['tokens_saved']:,}")
        print(f"savings_percent: {data['savings_percent']}%")
        print(f"\nFirst 500 chars of markdown:\n{data['markdown'][:500]}")
except urllib.error.HTTPError as e:
    print("ERROR", e.code, ":", e.read().decode())
