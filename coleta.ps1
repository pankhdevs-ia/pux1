# 1. Coleta de Informações do Sistema
$hostname = $env:COMPUTERNAME
$username = $env:USERNAME
$os = (Get-CimInstance Win32_OperatingSystem).Caption
$ramTotalGB = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)
$discoLivreGB = [math]::Round((Get-PSDrive C).Free / 1GB, 2)

# 2. Coleta de Rede (Velocidade da placa ativa e IP)
$adapter = Get-NetAdapter | Where-Object {$_.Status -eq 'Up'} | Select-Object -First 1
$velocidadeLink = if ($adapter) { "$($adapter.LinkSpeed)" } else { "Desconhecido" }
$ipLocal = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceIndex $adapter.ifIndex -ErrorAction SilentlyContinue).IPAddress

# 3. Teste de Ping (Latência para o Google 8.8.8.8)
$pingTest = Test-Connection -ComputerName "8.8.8.8" -Count 1 -Quiet
$pingMs = if ($pingTest) { 
    $res = Test-Connection -ComputerName "8.8.8.8" -Count 1; "$($res.ResponseTime) ms" 
} else { 
    "Timeout" 
}

# 4. Montagem do JSON com os dados
$body = @{
    cliente          = "Nome do Cliente Aqui"
    hostname         = $hostname
    usuario          = $username
    os               = $os
    ram              = "$ramTotalGB GB"
    disco_livre      = "$discoLivreGB GB"
    ip_local         = $ipLocal
    velocidade_placa = $velocidadeLink
    ping_ms          = $pingMs
} | ConvertTo-Json

# 5. Envio para o Webhook do Google Sheets
$webhookUrl = "SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI"
Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body -ContentType "application/json"

Write-Host "Coleta enviada com sucesso para a nuvem!" -ForegroundColor Green