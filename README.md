# CS2 Arbitraj Otomasyonu (SaaS)

Steam ve 3. parti pazar yerleri (CS Float vb.) arasında arbitraj yapan kullanıcıların manuel hesaplamalarını otomatize eden ve portföylerini takip etmelerini sağlayan bir web uygulamasıdır.

## Özellikler
- **Çift Aşamalı Arbitraj Hesaplayıcı:** Platform A'dan B'ye ve B'den A'ya yapılan işlemlerin net kar ve ROI hesaplaması.
- **İşlem Takibi (Trade Tracker):** Aktif pozisyonların kaydedilmesi ve 7 günlük takas banı için geri sayım.
- **Finansal Dashboard:** Kullanıcının toplam bakiyesini, aktif işlemlerini ve ROI durumunu gösteren modern arayüz.

## Teknolojiler
- Next.js (App Router)
- Tailwind CSS & Shadcn/UI
- Zustand (State Management)
- Supabase (Database & Auth)
- Recharts (Grafikler)

## Kurulum

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. `.env.local` dosyasını oluşturun ve Supabase bilgilerinizi girin:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

## GitHub Pages'e Deploy Etme

Proje statik olarak dışa aktarılacak (`output: 'export'`) şekilde yapılandırılmıştır.

1. `next.config.ts` dosyasındaki `basePath` ve `assetPrefix` ayarlarını GitHub deponuzun adına göre güncelleyin (örn: `/cs2-arbitraj`).
2. Deploy komutunu çalıştırın:
   ```bash
   npm run deploy
   ```
