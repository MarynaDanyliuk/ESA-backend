// // Import packages
// const express = require("express");
// const home = require("./routes/home");

// // Middlewares
// const app = express();
// app.use(express.json());

// // Routes
// app.use("/home", home);

// // connection
// const port = process.env.PORT || 9000;
// app.listen(port, () => console.log(`Listening to port ${port}`));

const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

require("dotenv").config();

const { META_PASSWORD, EMAIL_FROM } = process.env;

console.log(META_PASSWORD, EMAIL_FROM);

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// const corsOptions = {
//   origin: 'http://localhost:61224',
// };

// app.use(cors(corsOptions));

app.use(logger(formatsLogger));
app.use(cors());
// app.options('*', cors());
app.use(express.json());
app.use(express.static("public"));
const PORT = process.env.PORT || 9000;

// Парсинг вхідних даних
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Налаштування транспортера для відправки листів
const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465, // 25, 465, 2525
  secure: true,
  auth: {
    user: EMAIL_FROM,
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

// Функція для відправки електронної пошти
async function sendEmail(formData) {
  const {
    country,
    city,
    info,
    name,
    tel,
    email,
    comment,
    mailing,
    categories,
    statuses,
  } = formData;

  const mailOptions = {
    from: EMAIL_FROM,
    to: "manfimova@gmail.com",
    subject: `Нова форма з сайту ESA від ${name}`,
    text: `
      Країна: ${country}
      Місто: ${city}
      Інформація: ${info}
      Ім'я: ${name}
      Телефон: ${tel}
      Email: ${email}
      Коментар: ${comment}
      Підписка на розсилку: ${mailing}
      Вибрані категорії: ${categories ? categories.join(", ") : ""}
      Вибрані статуси: ${statuses ? statuses.join(", ") : ""}
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Маршрут для обробки POST-запитів
app.post("/submitForm", async (req, res) => {
  try {
    // Отримання даних з тіла запиту
    const formData = req.body;

    // Виклик функції для відправки електронної пошти
    await sendEmail(formData);

    // Відповідь на успішний запит
    res.status(200).send("Лист успішно відправлено");
  } catch (error) {
    // Обробка помилок
    console.error("Помилка відправки листа:", error);
    res.status(500).send("Помилка відправки листа");
  }
});

// Сервер слухає запити
app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
});
