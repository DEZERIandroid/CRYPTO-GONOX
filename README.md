<h1 align="center">
  <img src="https://github.com/user-attachments/assets/f1ad5a98-6ffe-47b9-8316-de3c6bda23f0" alt="CRYPTO-GONOX Logo" width="80" height="80" style="vertical-align: middle; margin-right: 15px; border-radius: 15px;">
  CRYPTO-GONOX
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Demo%20Available-brightgreen?style=for-the-badge&logo=rocket" alt="Status">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" alt="Version">
</p>

<p align="center">
  <b>Симулятор трейдинга виртуальной криптовалюты.</b><br>
  Соревнуйся, учи стратегии и входи в топ-лидеров — без риска для реальных средств.
</p>

<p align="center">
  <a href="https://dezeriandroid.github.io/CRYPTO-GONOX/">
    <img src="https://img.shields.io/badge/▶%20Открыть%20демо-FF4500?style=for-the-badge&logoColor=white" alt="Открыть демо">
  </a>
</p>

---

## 🎯 Зачем этот проект?

**CRYPTO-GONOX** — это учебная платформа, где можно:

* ✅ попробовать себя в трейдинге **без реальных денег**
* 🧠 понять, как работает рынок и твои решения
* 📊 увидеть результат своих действий в цифрах
* 🏆 сравнить себя с другими участниками

---

## ⚙️ Как это работает

1.  👋 Новый пользователь получает **виртуальный баланс**
2.  📈 Цены криптовалют — **реальные**, обновляются онлайн
3.  🤝 Можно покупать и продавать активы
4.  📝 Все сделки сохраняются
5.  🥇 Итоговый капитал участвует в **лидерборде**

---

## ✅ Реализовано

* 🔐 Авторизация (Firebase Auth)
* 💰 Виртуальный баланс пользователя
* 🔄 Реальные транзакции покупки / продажи
* 📜 История операций
* 👤 Просмотр профилей других пользователей
* 📊 Таблица лидеров
* 📈 Графики цен активов
* 📱 Адаптивный интерфейс

---

## 📸 Скриншоты

<details>
<summary><b>📺 Показать галерею скриншотов</b> (нажмите, чтобы развернуть)</summary>
<br>

| Главная | Профиль пользователя |
| :---: | :---: |
| <img width="100%" alt="Главная" src="https://github.com/user-attachments/assets/f1ad5a98-6ffe-47b9-8316-de3c6bda23f0" /> | <img width="100%" alt="Профиль" src="https://github.com/user-attachments/assets/1f948c05-7b28-4a08-bd38-f036b453ddc5" /> |
| *Баланс, портфель и быстрый доступ* | *Детальная информация об активах* |

| Рынок криптовалют | История транзакций |
| :---: | :---: |
| <img width="100%" alt="Рынок" src="https://github.com/user-attachments/assets/04f05106-a4e8-47e0-9cb5-059147fb724c" /> | <img width="100%" alt="История" src="https://github.com/user-attachments/assets/1d2a3739-64f2-4e76-94be-9de671b55b26" /> |
| *Список доступных монет и цены* | *Полный лог всех ваших сделок* |

| Лидерборд |
| :---: |
| <img width="70%" alt="Лидерборд" src="https://github.com/user-attachments/assets/3d8800eb-55db-4eb0-851f-902eca81c457" /> |
| *Топ лучших трейдеров платформы* |

</details>

---

## 🛠️ Стек технологий

Проект структурирован по методологии **FSD (Feature-Sliced Design)**, что обеспечивает масштабируемость и чистоту кода.

<p align="left">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/Chakra%20UI-319795?style=for-the-badge&logo=chakraui&logoColor=white" alt="Chakra UI">
  <img src="https://img.shields.io/badge/Recharts-22b5bf?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Recharts">
</p>

---

## 🚀 Запуск локально

Попробуйте запустить проект на своем компьютере.

```bash
# 1. Клонируйте репозиторий
git clone [https://github.com/DEZERIandroid/CRYPTO-GONOX.git](https://github.com/DEZERIandroid/CRYPTO-GONOX.git)

# 2. Перейдите в папку проекта
cd CRYPTO-GONOX

# 3. Установите зависимости
npm install

# 4. Запустите сервер для разработки
npm run dev



---

## 🔥 Настройка Firebase

Для работы облачных функций и базы данных необходимо связать проект с вашим инстансом Firebase.

1. Создайте файл `.env` в корневой директории.
2. Скопируйте и заполните следующие переменные:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

[!TIP]
Все эти ключи доступны в Project Settings (иконка шестеренки) в консоли Firebase.

---

## Что дальше



[ ] История портфеля по времени



[ ] Расширенная аналитика сделок



[ ] Больше криптовалют



[ ] Админ-панель



[ ] Улучшение UX и мобильной версии





















---

## Общие характеристики







### Производительность:

 - загрузка ≤ 2 сек

 - обновление цен ≤ 5 сек



### Масштабируемость:

 - ≥ 10 000 одновременных пользователей



### Безопасность:

 - Firebase Auth

 - строгие правила Firestore



### Надёжность:

 - аптайм ≥ 99.5%

 - обработка сбоев API



### Поддерживаемость:

 - чистый TS/React код

 - тесты

 - документация



### Роли пользователей:



 - Гость: регистрация, просмотр лидерборда (ограниченно)

 - Пользователь: полный доступ к трейдингу и портфелю

 - Админ: редактирование и изменение настроек.

сделаешь классным ? текст не меняй, просто дизайны добавь