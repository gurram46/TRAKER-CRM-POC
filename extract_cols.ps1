$c = Get-Content 'C:\Users\sande\Downloads\Email format.html' -Raw
$start = $c.IndexOf('Vendor Details')
$s = $c.Substring($start, 5000)
Write-Output $s
