from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import convert
from models.schemas import HealthResponse

app = FastAPI(title="MarkSave API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(convert.router)


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="ok")
