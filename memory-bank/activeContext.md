# Active Context

## Şu An Ne Üzerinde Çalışıyoruz?
Temel bileşenlerin (Calculator, TradeCard, Dashboard) oluşturulması ve Zustand ile state yönetiminin sağlanması tamamlandı. Supabase entegrasyonu için gerekli dosyalar oluşturuldu.

## Bir Sonraki Adım
1. Supabase üzerinde `Users` ve `Trades` tablolarını oluşturmak.
2. Dashboard'a Recharts ile grafikler ekleyerek finansal verileri görselleştirmek.
3. Uygulamayı test edip GitHub Pages'e deploy etmek.

## Güncel Durum
- Next.js projesi oluşturuldu.
- Memory-Bank mimarisi kuruldu.
- Bağımlılıklar yüklendi.
- `calculations.ts` ile arbitraj formülleri eklendi.
- Zustand store (`useTradeStore.ts`) oluşturuldu.
- `Calculator`, `TradeCard` ve `Dashboard` bileşenleri yazıldı.
- Supabase client ve `.env.local` yapılandırıldı.
- GitHub Pages için `next.config.ts` ve `deploy` scripti eklendi.
