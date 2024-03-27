// const express = require("express");
// const router = express.Router();
// const nodemailer = require("nodemailer");

// require("dotenv").config();

// const { META_PASSWORD, EMAIL_FROM, EMAIL_TO } = process.env;

// // Налаштування транспортера для відправки листів
// const nodemailerConfig = {
//   host: "smtp.meta.ua",
//   port: 465, // 25, 465, 2525
//   secure: true,
//   auth: {
//     user: EMAIL_FROM,
//     pass: META_PASSWORD,
//   },
// };

// const transporter = nodemailer.createTransport(nodemailerConfig);

// // Функція для відправки електронної пошти
// async function sendEmail(formData) {
//   const {
//     country,
//     city,
//     info,
//     name,
//     tel,
//     email,
//     comment,
//     mailing,
//     categories,
//     statuses,
//   } = formData;

//   const mailOptions = {
//     from: EMAIL_FROM,
//     to: EMAIL_TO,
//     subject: `Нова форма з сайту ESA від ${name}`,
//     text: `
//       Країна: ${country}
//       Місто: ${city}
//       Інформація: ${info}
//       Ім'я: ${name}
//       Телефон: ${tel}
//       Email: ${email}
//       Коментар: ${comment}
//       Підписка на розсилку: ${mailing}
//       Вибрані категорії: ${categories ? categories.join(", ") : ""}
//       Вибрані статуси: ${statuses ? statuses.join(", ") : ""}
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// }

// router.post("/submitForm", async (req, res) => {
//   try {
//     // Отримання даних з тіла запиту
//     const formData = req.body;

//     // Виклик функції для відправки електронної пошти
//     await sendEmail(formData);

//     // Відповідь на успішний запит
//     res.status(200).send("Лист успішно відправлено");
//   } catch (error) {
//     // Обробка помилок
//     console.error("Помилка відправки листа:", error);
//     res.status(500).send("Помилка відправки листа");
//   }
// });

// module.exports = router;
