# Tech Context

## Kullanılan Teknolojiler
- **Frontend:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS, Shadcn/UI (Lucide Icons, Radix UI)
- **State Management:** Zustand (Hafif ve hızlı olduğu için tercih edildi)
- **Backend/Database:** Supabase (PostgreSQL) - Client-side SDK üzerinden yönetilecek.
- **Charts:** Recharts (Finansal verilerin görselleştirilmesi için)
- **Hosting:** GitHub Pages (Serverless, Static Export)

## Teknik Kararlar
1. **Serverless Mimari:** Proje GitHub Pages üzerinde hostlanacağı için Next.js `output: 'export'` ayarı ile statik olarak derlenecek. Bu nedenle Prisma veya özel bir Node.js backend'i kullanılmayacak. Tüm veritabanı işlemleri Supabase Client-side SDK üzerinden yönetilecek.
2. **State Management:** React Context API yerine Zustand tercih edildi, çünkü daha az boilerplate kod gerektiriyor ve performans açısından daha verimli.
3. **Hesaplamalar:** `calculations.ts` adında bir utility dosyası oluşturularak matematiksel formüller (Net Satış Geliri, ROI, Kümülatif Bakiye) merkezi bir yerde toplanacak. Yuvarlama hatalarını önlemek için bakiye hesaplamalarında hassas davranılacak.
4. **UI/UX:** Dark mode odaklı, finansal verilerin ön planda olduğu bir Dashboard tasarlanacak. ROI yüzdesi pozitifse yeşil, negatifse kırmızı vurgulanacak. Mobil uyumlu (Responsive) tablo yapısı kullanılacak.
