---
title: 'Cara ubah garis indent vscode menjadi rainbow'
description: 'Cara ubah garis indent vscode menjadi rainbow...'
pubDate: 'Nov 04 2025 19:44'
heroImage: 'https://res.cloudinary.com/dybxqdxat/image/upload/v1762260080/banner-blog_lj4h5j.jpg'
author: 'Ichsan'
tags: ['sharing', 'tech', 'technology', 'tutorial', 'vscode']
publish: true
---
Pernah nggak sih kamu buka file JavaScript atau TypeScript yang isinya nested function sampai mata rasanya keriting? 😅
Nah, di situlah Indent Guides di VSCode sebenarnya penyelamat — tapi kadang tampilannya membosankan banget. Garis-garis abu-abu lurus semua, susah membedakan level kode.

Di artikel ini, aku bakal tunjukin gimana caranya bikin garis indent kamu berwarna-warni (rainbow style) biar coding terasa lebih rapi, nyaman, estetik, dan Mudah banget buat lacak struktur if, for, dan class di kode panjang tanpa pusing. 
1. Silahkan buka VSCODE nya, lalu <KBD>CTRL</KBD> + <KBD>,</KBD> seperti pada di gambar. Lakukan pencarian `editorIndent` dan <mark>klik edit in settings.json</mark>
![indent guide rainbow](https://res.cloudinary.com/dybxqdxat/image/upload/v1762260745/banner-blog-1_u79nh1.png)
2. Masukan kode berikut ke dalam `settings.json`
```markdown
{
  "editor.guides.indentation": true,
  "editor.guides.highlightActiveIndentation": true,

  // warna garis indent (rainbow-style)
  "workbench.colorCustomizations": {
    "editorIndentGuide.background1": "#FF5F56",
    "editorIndentGuide.background2": "#FFBD2E",
    "editorIndentGuide.background3": "#27C93F",
    "editorIndentGuide.background4": "#00C7FF",
    "editorIndentGuide.background5": "#AF52DE",
    "editorIndentGuide.activeBackground1": "#FF5F56",
    "editorIndentGuide.activeBackground2": "#FFBD2E",
    "editorIndentGuide.activeBackground3": "#27C93F",
    "editorIndentGuide.activeBackground4": "#00C7FF",
    "editorIndentGuide.activeBackground5": "#AF52DE",
    "editor.bracketPairColorization.enabled": true,
    "editor.guides.bracketPairs": "active"
  },
  "editor.indentSize": "tabSize"
}

```
![indent guide rainbow](https://res.cloudinary.com/dybxqdxat/image/upload/v1762260750/banner-blog-2_ow5g4m.png)
3. Silahkan close vscode lalu buka kembali, jika sudah seperti pada di gambar. Maka telah selesai 🎊
![indent guide rainbow](https://res.cloudinary.com/dybxqdxat/image/upload/v1762260080/banner-blog_lj4h5j.jpg)