# Active Context

## Su An Ne Uzerinde Calisiyoruz?
Proje Firebase tabanli kimlik dogrulama ve bulut senkronizasyonuna gecirildi. Son odak noktasi GitHub Pages workflow tetikleme sorununu cozmek ve deployment akisini stabil hale getirmek.

## Bir Sonraki Adim
1. GitHub repository secrets degerlerinin tam girildigini dogrulamak.
2. Actions uzerinden ilk otomatik deploy'un basariyla tamamlandigini teyit etmek.
3. Gerekirse custom domain baglantisinin yapilmasi.

## Guncel Durum
- Firebase Email/Password + Google giris akisi aktif.
- Firestore uzerinden kullaniciya ozel trade senkronizasyonu aktif.
- Profil adi tamamlama akisi eklendi (Google displayName otomatik doldurma).
- Login/Register UI modernlestirildi ve metinler sade kullanici diline cekildi.
- GitHub Pages workflow push tetikleyicisi `master` ve `main` dallarini kapsayacak sekilde duzeltildi.
