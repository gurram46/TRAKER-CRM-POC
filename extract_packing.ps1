$c = Get-Content 'C:\Users\sande\Downloads\Email format.html' -Raw
$start = $c.IndexOf('Packing and forwarding charges')
$s = $c.Substring($start - 200, 1000)
Write-Output $s
