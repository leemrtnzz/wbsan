---
title: 'Force Windows 11 to stop performing automatic updates'
description: 'ZEHAHAHAHAHAHAHAHA'
pubDate: 'Nov 02 2025 22:40'
heroImage: '../../assets/win-trash.png'
author: 'Ichsan'
tags: ['sharing', 'tech', 'technology', 'windows']
publish: true
---
Kali ini gw bakal share trik (permanent fix) memaksa Windows 11 untuk berhenti melakukan update otomatis, sehingga lu bakal bebas melakukan update kapanpun, bahkan bisa memilih update yang ingin diinstall (menjadi manual update)
Software yang digunakan untuk memilih update ini adalah opsional & supplement saja, bisa didownload jika membutuhkannya
[Disini](https://github.com/DavidXanatos/wumgr/releases/download/v1.1/WuMgr_v1.1b.zip)
Untuk memaksa Windows berhenti melakukan auto update bisa dilakukan dengan cara:
1) Buka cmd.exe sebagai admin
2) Ketik line berikut ini secara berurutan (copy, paste, enter)
```markdown
> Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" /v "NoAutoUpdate" /t REG_DWORD /d "0" /f
> Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" /v "AUOptions" /t REG_DWORD /d "2" /f
> Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" /v "ScheduledInstallDay" /t REG_DWORD /d "0" /f
> Reg.exe add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" /v "ScheduledInstallTime" /t REG_DWORD /d "3" /f
```

ada beberapa bug di mana Windows Defender yang bergantung pada Windows Update bakal berhenti menerima malware definition sample secara otomatis, sehingga lu harus install update windef secara manual untuk memastikannya menggunakan antimalware engine versi terbaru
Setidaknya gw udah ngasih tau potensi resiko dari modifikasi permanent ini
Tested on:
```markdown
Windows 10 21H1 (last EoL update)
Windows 11 24H2
Not compatible for:
Windows 10 21H2 & 22H2
```

>Windows Update manager yang gw kasih link tadi juga punya kemampuan untuk hide (sembunyikan / abaikan) update yang problematik,
>sehingga update problematik gak bakal ditawarkan lagi oleh Windows Update, cocok untuk driver update


<mark>Important note:</mark> 

Dengan menerapkan permanent fix ini, gw bakal menganggap lu paham & siap menanggung resiko jika lalai melakukan update windows & paham akan bahaya zero-day exploit yang siap menyerang device yang vulnerable (rentan) Jangan lakukan ini di server production berbasis Windows tanpa mempertimbangkan resiko (ingat kasus PDNS untuk dampak yang terburuk) Lebih baik MENUNDA UPDATE daripada tidak memasang update sama sekali.

Buat yang gak paham seberapa berbahaya device yang gak pernah install update, bisa liat kembali kasus ransomware Wannacry yang nyusup lewat SMB Share exploit, lu gak ngapa2in tiba-tiba kena ransomware aja.
Atau bisa baca post [ini](https://www.facebook.com/chandra.nand4/posts/pfbid02u3ZQzmuWQqQJEdsy3xdGC2syK6eQkFsY8nAdvrCGoGZyzjdQ3uDTzCCa2uPvQ9vzl)
## Links

Kalian bisa coba [Disini](https://fh-wlan.vercel.app/) / [API](https://fh-wlan.vercel.app/api/generate?ssid=)