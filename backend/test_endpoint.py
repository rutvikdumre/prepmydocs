import urllib.request
import urllib.error

boundary = "boundary123"
filename = "test.pdf"
content = b"%PDF-1.4 fake pdf content for testing"

body = (
    b"--" + boundary.encode() + b"\r\n"
    b'Content-Disposition: form-data; name="file"; filename="test.pdf"\r\n'
    b"Content-Type: application/pdf\r\n\r\n"
    + content
    + b"\r\n--"
    + boundary.encode()
    + b"--\r\n"
)

req = urllib.request.Request(
    "http://localhost:8000/convert",
    data=body,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    method="POST",
)

try:
    with urllib.request.urlopen(req) as r:
        print("SUCCESS:", r.read().decode())
except urllib.error.HTTPError as e:
    print("ERROR", e.code, ":", e.read().decode())
