# CS Arbitrage Tracker

Bu proje şu anda tek ekranlı, tarayıcıda çalışan bir arbitraj takip aracı olarak sadeleştirildi. Amaç, eski prototipteki davranışı Next.js uygulaması içinde sürdürmek:

- Steam -> CSFloat ve CSFloat -> Steam islemleri
- Anlık net satış ve verim hesabı
- İşlem ekleme, düzenleme ve silme
- Kayıtları tarayıcı `localStorage` içinde saklama
- Opsiyonel yerel giriş sistemi altyapısı
- Açık, koyu ve sistem teması desteği

## Mevcut Durum

Uygulama sunucuya veri göndermeden çalışır. Sunucu tarafı veritabanı ve bulut senkronizasyonu aktif değildir. Giriş sistemi varsayılan olarak kapalıdır.

## Sonra Eklenecekler

- Opsiyonel kullanıcı girişi
- Supabase ile bulut veri saklama
- Çoklu cihaz senkronizasyonu

## Kurulum

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

3. Tarayıcıda `http://localhost:3000` adresini açın.

## Opsiyonel Yerel Giriş

Varsayılan durumda uygulama giriş istemez. İsterseniz `.env.local` içine şu satırı ekleyerek yerel oturum modunu açabilirsiniz:

```env
NEXT_PUBLIC_ENABLE_LOCAL_AUTH=true
```

Bu mod sadece aynı tarayıcıda basit bir kullanıcı adı tutar. Daha sonra Supabase Auth gibi gerçek bir sisteme bağlanmak için iskelet olarak hazırlandı.

## Tema

Uygulama varsayılan olarak cihazın tema tercihini izler. İsteyen kullanıcı arayüzdeki tema anahtarından açık, koyu veya sistem modunu seçebilir.

## Mimari

- `src/components/Dashboard.tsx`: Sayfanın ana akışı
- `src/components/TradeForm.tsx`: Canlı hesaplama ve ekleme/düzenleme formu
- `src/components/TradeSummary.tsx`: Özet kartları
- `src/components/TradeTable.tsx`: Kayıt listesi ve aksiyonlar
- `src/components/AuthPanel.tsx`: Opsiyonel yerel giriş paneli
- `src/components/ThemeToggle.tsx`: Tema anahtarı
- `src/store/useTradeStore.ts`: Yerel durum yönetimi
- `src/store/useAuthStore.ts`: Opsiyonel yerel oturum durumu
- `src/utils/calculations.ts`: Komisyon, net satış ve oran hesapları
