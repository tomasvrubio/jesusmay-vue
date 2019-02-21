const express = require("express"),
      bodyParser = require("body-parser"),
      cors = require("cors"), 
      morgan = require("morgan");


const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());


app.get('/status', (req, res) => {
  res.send({
    message: "hello world",
  })
});

app.post('/register', (req, res) => {
  res.send({
    message: `Hello ${req.body.email}! Your user was registered`
  });
})



app.listen(process.env.PORT || 8081);


console.log("Hello");

