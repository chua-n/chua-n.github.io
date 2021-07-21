Set ws = WScript.CreateObject("WScript.Shell")
ws.run "wsl -d Ubuntu-20.04 -u root bash /home/chuan/serviceStartup.sh", 0