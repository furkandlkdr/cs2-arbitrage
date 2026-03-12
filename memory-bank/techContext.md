# Tech Context

## Kullanilan Teknolojiler
- Frontend: Next.js (App Router), React, TypeScript
- Styling: Tailwind CSS v4 ve global CSS
- State Management: Zustand
- Veri Saklama: Tarayici localStorage
- Deployment: GitHub Pages workflow + static export

## Teknik Kararlar
1. Proje simdilik local-first calisir; zorunlu backend yoktur.
2. Hesaplamalar `src/utils/calculations.ts` icinde merkezi olarak tutulur.
3. UI tek sayfalik bir akis olarak tasarlanir; `test.html` ile davranis esitligi hedeflenir.
4. Durum yonetiminde Zustand kullanilir, kalicilik ise component tarafindan localStorage ile saglanir.
5. Login sistemi opsiyonel local mod olarak hazir tutulur; varsayilan durumda kapalidir.
6. Tema secimi localStorage icinde saklanir; varsayilan mod sistem temasidir.
7. GitHub Pages icin Next.js `output: 'export'` kullanilir; statik cikti klasoru `out/` olur.
8. Deployment workflow dosyasi `.github/workflows/deploy.yml` altinda tutulur ve artifact olarak `out/` klasorunu yukler.
