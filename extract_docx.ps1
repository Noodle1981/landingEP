$docxPath = "C:\Users\Administrador\Desktop\Xamanen-Landing\landingEP\Estrategia_Marca_Industrias_Xamanen_v2.docx"
$tempDir = Join-Path $env:TEMP "xamanen_extract"

# Limpiar directorio temporal si existe
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}

# Extraer el contenido del .docx (que es un ZIP)
Expand-Archive -Path $docxPath -DestinationPath $tempDir -Force

# Leer el XML del documento
$xmlPath = Join-Path $tempDir "word\document.xml"
$xmlContent = Get-Content $xmlPath -Raw

# Extraer texto de los nodos <w:t>
$xmlContent = $xmlContent -replace '<w:t[^>]*>([^<]*)</w:t>', '$1 '
$xmlContent = $xmlContent -replace '<[^>]+>', ''
$xmlContent = $xmlContent -replace '\s+', ' '
$xmlContent = $xmlContent.Trim()

# Mostrar el contenido
Write-Output $xmlContent

# Limpiar
Remove-Item -Recurse -Force $tempDir
