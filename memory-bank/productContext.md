# Product Context

## Projenin Amaci
Bu proje Steam ve CSFloat arasindaki arbitraj islemlerini hizli hesaplamak, kullanici hesabina ozel kaydetmek ve farkli cihazlardan ayni veriye erisim saglamak icin tasarlanmistir.

## Neden Yapiliyor?
Asil proje daha buyuk bir SaaS yapisi icin acilmisti. Ilk adimda kritik akislar korunarak temel urun tamamlandi, ardindan kullanici girisi ve bulut senkronizasyonu devreye alinarak coklu cihaz kullanimi saglandi.

## Temel Ozellikler
1. Tek adim islem hesaplama: Steam -> CSFloat veya CSFloat -> Steam
2. Canli onizleme: Net satis, komisyon ve verim aninda gosterilir
3. Kayit yonetimi: Islem ekleme, duzenleme ve silme
4. Bulut veri saklama: Veriler kullanici hesabina ozel Firestore'da tutulur
5. Tema destegi: Acik, koyu ve sistem temasina uyum
6. Kimlik dogrulama: E-posta/sifre ve Google ile giris
