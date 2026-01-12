# Clean and rebuild project
npm run clean
npm cache clear --force
npm install
npm audit fix --force
npm run build

# Zip the dist folder
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipFileName = "dist-$timestamp.zip"

if (Test-Path "dist") {
    Compress-Archive -Path "dist" -DestinationPath $zipFileName -Force
    Write-Host "Build complete! Created $zipFileName" -ForegroundColor Green
} else {
    Write-Host "Error: dist folder not found" -ForegroundColor Red
}