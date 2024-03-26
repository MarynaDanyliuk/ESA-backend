const express = require("express");
const router = express.Router();

router.post("/submitForm", async (req, res) => {
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

module.exports = router;
