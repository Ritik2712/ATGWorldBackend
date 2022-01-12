const router = require("express").Router();
let User = require("../Modals/user.modal");
const jwt = require("jsonwebtoken");
const { authUSer } = require("../middleWare/authUser");

router.route("/add").post((req, res) => {
  const username = { firstName: req.body.firstName, lastName: req.body.lastName, password: req.body.password, email: req.body.email, goupJoin: "Falses" };
  const newUser = new User(username);
  const TOKEN = jwt.sign({ password: req.body.password, email: req.body.email, _id: newUser }, process.env.SECRET_KEY);
  console.log(process.env.SECRET_KEY, newUser, TOKEN);
  newUser
    .save()
    .then(() => res.json({ firstName: req.body.firstName, lasstName: req.body.lastName, email: req.body.email, goupJoin: "False", token: TOKEN }))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/signup").post(async (req, res) => {
  try {
    const x = await User.findOne({ email: req.body.email });
    if (x === null) {
      throw 'user not found'
    } else {
      if (x.password === req.body.password) {
        const TOKEN = jwt.sign(
          {
            email: req.body.email,
            password: req.body.password,
            _id: x._id,
          },
          process.env.SECRET_KEY
        );
        console.log(x)
        res.json({ firstName: x.firstName, lastName: x.lastName, email: x.email, groupJoin: x.groupJoin, token: TOKEN });
      } else {
        throw 'Wrong password'
      }
    }
  } catch (e) {
    return res.status(403).json(e);
  }
});

router.put("/join", [authUSer], async (req, res) => {
  try {
    const x = User.updateOne({
      email: req.user.email
    },
      { $set: { goupJoin: req.body.bool } }
    )
  }
  catch (e) {
    res.status(500).json("Some error occur")
  }
})

module.exports = router;
