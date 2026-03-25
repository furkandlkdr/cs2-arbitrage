# Tech Context

## Kullanilan Teknolojiler
- Frontend: Next.js (App Router), React, TypeScript
- Styling: Tailwind CSS v4 ve global CSS
- State Management: Zustand
- Kimlik Dogrulama: Firebase Authentication (Email/Password + Google)
- Veri Saklama: Cloud Firestore (kullaniciya ozel) + istemci state
- Deployment: GitHub Pages workflow + static export

## Teknik Kararlar
1. Proje Firebase backend servislerini istemci tarafindan kullanir, sunucu tarafi runtime zorunlu degildir.
2. Hesaplamalar `src/utils/calculations.ts` icinde merkezi olarak tutulur.
3. UI tek sayfalik bir akis olarak tasarlanir; `test.html` ile davranis esitligi hedeflenir.
4. Durum yonetiminde Zustand kullanilir; trade kaliciligi Firestore realtime subscription ile saglanir.
5. Auth state `onAuthStateChanged` ile senkronize edilir; giris yoksa uygulama islemleri kilitlenir.
6. Tema secimi localStorage icinde saklanir; varsayilan mod sistem temasidir.
7. GitHub Pages icin Next.js `output: 'export'` kullanilir; statik cikti klasoru `out/` olur.
8. Deployment workflow dosyasi `.github/workflows/deploy.yml` altinda tutulur, push tetikleyicisi `master/main` dallarini dinler ve artifact olarak `out/` klasorunu yukler.
