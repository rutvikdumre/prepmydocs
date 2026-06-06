# MarkSave — start backend and frontend
Write-Host "Starting MarkSave backend on http://localhost:8000 ..." -ForegroundColor Cyan
$backend = Start-Job -ScriptBlock {
    Set-Location "C:\Projects\developmyai\backend"
    $env:PYTHONPATH = "C:\Projects\developmyai\backend"
    python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload 2>&1
}

Start-Sleep -Seconds 3
Write-Host "Starting MarkSave frontend on http://localhost:5173 ..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/k cd /d C:\Projects\developmyai\frontend && npm run dev"

Write-Host ""
Write-Host "MarkSave is starting up!" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "  API docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the backend job." -ForegroundColor Gray

try {
    while ($true) {
        $output = Receive-Job -Job $backend
        if ($output) { Write-Host $output }
        Start-Sleep -Seconds 2
    }
} finally {
    Stop-Job -Job $backend
    Remove-Job -Job $backend
}
