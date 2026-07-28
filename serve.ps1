$root = "C:\Users\idris\.gemini\antigravity\scratch\invoicemate-global"
$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:${port}/")
$listener.Start()
Write-Host ""
Write-Host "  ========================================"
Write-Host "  InvoiceMate Global - Local Server"
Write-Host "  ========================================"
Write-Host ""
Write-Host "  Serving on: http://localhost:${port}"
Write-Host "  Root:        $root"
Write-Host ""
Write-Host "  Open http://localhost:${port} in your browser!"
Write-Host "  Press Ctrl+C to stop the server."
Write-Host ""

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    $file = Join-Path $root $path.TrimStart("/")

    if (Test-Path $file -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        $mime = switch ($ext) {
            ".html" { "text/html; charset=utf-8" }
            ".css"  { "text/css; charset=utf-8" }
            ".js"   { "application/javascript; charset=utf-8" }
            ".json" { "application/json; charset=utf-8" }
            ".png"  { "image/png" }
            ".jpg"  { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            ".gif"  { "image/gif" }
            ".svg"  { "image/svg+xml" }
            ".ico"  { "image/x-icon" }
            ".woff" { "font/woff" }
            ".woff2"{ "font/woff2" }
            default { "application/octet-stream" }
        }
        $ctx.Response.ContentType = $mime
        $ctx.Response.ContentLength64 = $bytes.Length
        $ctx.Response.StatusCode = 200
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        Write-Host "  200  $path"
    } else {
        $body = [System.Text.Encoding]::UTF8.GetBytes("404 - Not Found")
        $ctx.Response.StatusCode = 404
        $ctx.Response.ContentType = "text/plain"
        $ctx.Response.ContentLength64 = $body.Length
        $ctx.Response.OutputStream.Write($body, 0, $body.Length)
        Write-Host "  404  $path"
    }
    $ctx.Response.Close()
}
