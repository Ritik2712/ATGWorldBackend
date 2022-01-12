const router = require("express").Router();
let Message = require("../Modals/Message.modal");
const { authUSer } = require("../middleWare/authUser");

router.post("/add", [authUSer], (req, res) => {
  const message = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  };
  const newMessage = new Message(message);
  newMessage
    .save()
    .then(() => res.json("Message added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
