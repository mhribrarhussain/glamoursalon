$htmlPath = "index.html"
$cssPath = "style.css"
$assetsDir = "assets/images"

if (!(Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Force -Path $assetsDir | Out-Null
}

$htmlContent = Get-Content $htmlPath -Raw
$cssContent = Get-Content $cssPath -Raw

$pattern = "https://images.unsplash.com/[a-zA-Z0-9\-\?\&\%=]+"

$allMatches = ([regex]::Matches($htmlContent, $pattern).Value + [regex]::Matches($cssContent, $pattern).Value) | Select-Object -Unique

$counter = 1
$map = @{}

foreach ($url in $allMatches) {
    # Generate local filename based on counter
    $localFileName = "img-$counter.jpg"
    $localFilePath = "$assetsDir/$localFileName"
    
    Write-Host "Downloading $url to $localFilePath"
    Invoke-WebRequest -Uri $url -OutFile $localFilePath
    
    $map[$url] = "assets/images/$localFileName"
    $counter++
}

# Replace in files
foreach ($url in $map.Keys) {
    $htmlContent = $htmlContent.Replace($url, $map[$url])
    $cssContent = $cssContent.Replace($url, "../" + $map[$url]) # for CSS, it depends on path, but CSS is in same dir, so "assets/images/..."
}

# Wait, CSS is in same directory as HTML, so it should also use "assets/images/img-X.jpg"
$cssContent = Get-Content $cssPath -Raw
foreach ($url in $map.Keys) {
    $cssContent = $cssContent.Replace($url, $map[$url])
}

Set-Content -Path $htmlPath -Value $htmlContent
Set-Content -Path $cssPath -Value $cssContent

Write-Host "All done!"
