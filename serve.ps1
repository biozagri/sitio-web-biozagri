# Simple static HTTP server for BIOZAGRI website
param([int]$Port = 3000)

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "BIOZAGRI server running at http://localhost:$Port" -ForegroundColor Green

$root = Split-Path $MyInvocation.MyCommand.Path

$mimeTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.mp4'  = 'video/mp4'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.png'  = 'image/png'
  '.gif'  = 'image/gif'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
  '.woff2'= 'font/woff2'
  '.woff' = 'font/woff'
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response

  $urlPath = $req.Url.LocalPath -replace '/', '\'
  if ($urlPath -eq '\' -or $urlPath -eq '') { $urlPath = '\index.html' }
  $filePath = Join-Path $root $urlPath.TrimStart('\')

  try {
    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $mime = if ($mimeTypes[$ext]) { $mimeTypes[$ext] } else { 'application/octet-stream' }
      $res.ContentType = $mime
      if ($ext -eq '.mp4') {
        $rangeHeader = $req.Headers['Range']
        $fileInfo = [System.IO.FileInfo]::new($filePath)
        $fileLen  = $fileInfo.Length
        if ($rangeHeader -and $rangeHeader -match 'bytes=(\d+)-(\d*)') {
          $start = [long]$Matches[1]
          $end   = if ($Matches[2]) { [long]$Matches[2] } else { $fileLen - 1 }
          $end   = [Math]::Min($end, $fileLen - 1)
          $chunkSize = $end - $start + 1
          $res.StatusCode = 206
          $res.Headers.Add('Content-Range', "bytes $start-$end/$fileLen")
          $res.Headers.Add('Accept-Ranges', 'bytes')
          $res.ContentLength64 = $chunkSize
          $fs = [System.IO.FileStream]::new($filePath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read)
          $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
          $buf = [byte[]]::new([Math]::Min(65536, $chunkSize))
          $remaining = $chunkSize
          while ($remaining -gt 0) {
            $toRead = [Math]::Min($buf.Length, $remaining)
            $read = $fs.Read($buf, 0, $toRead)
            if ($read -le 0) { break }
            $res.OutputStream.Write($buf, 0, $read)
            $remaining -= $read
          }
          $fs.Close()
        } else {
          $res.Headers.Add('Accept-Ranges', 'bytes')
          $res.ContentLength64 = $fileLen
          $bytes = [System.IO.File]::ReadAllBytes($filePath)
          $res.OutputStream.Write($bytes, 0, $bytes.Length)
        }
      } else {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      }
    } else {
      $res.StatusCode = 404
      $body = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
      $res.ContentLength64 = $body.Length
      $res.OutputStream.Write($body, 0, $body.Length)
    }
  } catch {
    $res.StatusCode = 500
  } finally {
    $res.OutputStream.Close()
  }
}
