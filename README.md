# 🎬 ShowCase (SeriesLab) - Modern Dizi İnceleme Platformu

Bu proje, React ekosistemindeki modern teknolojileri pekiştirmek ve **Full Stack (Serverless)** mimari yetkinliğimi geliştirmek amacıyla oluşturulmuş, gerçek zamanlı bir dizi inceleme uygulamasıdır.

## 🎯 Projenin Amacı
Bu projeyi geliştirirken odaklandığım temel hedefler:
- **Redux Toolkit** ile global state yönetimini (Auth, Data Fetching) profesyonelce kurgulamak.
- **Firebase** (Authentication & Firestore) kullanarak sunucusuz (serverless) backend mimarisini öğrenmek.
- **React Router** ile Korumalı Rotalar (Private Routes) ve Dinamik Yönlendirme (Dynamic Routing) yapılarını kurmak.
- **Modern UI/UX** prensiplerini Tailwind CSS ile hayata geçirmek (Skeleton Loading, Optimistic UI, Toast Bildirimleri).

## 🛠️ Kullanılan Teknolojiler

| Alan | Teknoloji |
| --- | --- |
| **Frontend** | React, Vite |
| **State Yönetimi** | Redux Toolkit (Slices, AsyncThunk) |
| **Backend / DB** | Firebase (Auth, Firestore) |
| **Stil / Tasarım** | Tailwind CSS |
| **Veri Kaynağı** | OMDb API |
| **Diğer Araçlar** | React Router Dom, React Hot Toast, React Icons |

## ✨ Özellikler

- **🔐 Kimlik Doğrulama:** Firebase ile güvenli Kayıt Ol / Giriş Yap sistemi.
- **🛡️ Korumalı Rotalar:** Giriş yapmayan kullanıcıların detay sayfalarına erişiminin engellenmesi.
- **🔍 Detaylı Arama:** OMDb API entegrasyonu ile binlerce diziye anlık erişim.
- **💬 Gerçek Zamanlı Yorumlar:** Firestore sayesinde sayfayı yenilemeden anlık düşen yorumlar.
- **👁️ Spoiler Koruması:** Spoiler içeren yorumların otomatik olarak blurlanması ve tıklanınca açılması.
- **🚀 Optimistic UI:** Sayfa geçişlerinde verilerin beklemeden yüklenmesi (Hızlı deneyim).
- **📱 Responsive Tasarım:** Mobil ve masaüstü uyumlu karanlık mod (Dark Mode) arayüz.

-**Created By Unreality**
Bu proje kişisel gelişim amacıyla geliştirilmiştir