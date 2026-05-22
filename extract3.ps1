$c = Get-Content 'C:\Users\sande\Downloads\Email format.html' -Raw
$start = $c.IndexOf('Terms &amp; Conditions')
if ($start -lt 0) { $start = $c.IndexOf('Terms & Conditions') }
$s = $c.Substring($start, 5000)
Write-Output $s
