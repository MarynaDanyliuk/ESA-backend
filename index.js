const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

require("dotenv").config();

const home = require("./routes/home");
// const submitRouter = require("./routes/submit");

const { META_PASSWORD, EMAIL_FROM, EMAIL_TO } = process.env;

// console.log(META_PASSWORD, EMAIL_FROM, EMAIL_TO);

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());

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
    to: EMAIL_TO,
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

// Routes
app.use("/home", home);
// app.use("/submitForm", submitRouter);

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

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// Сервер слухає запити
app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
});

// ___________________________________
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
