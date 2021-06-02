//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/postsDB", {useNewUrlParser: true, useUnifiedTopology: true});

//Mongoose & Mongodb

const postSchema= {
  title: {
    type: String,
    required: [1, "Please check Entered value again, and enter a title"]
  },
  body: {
    type: String,
    required: [1, "Please check the Entered value again, and Enter a post Message"]
  }
};

const Post=mongoose.model("post", postSchema);

//-------------

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutStartingContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactStartingContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

let any="";

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

app.get("/", (req, res)=> {
  Post.find((err, docs)=> {
    res.render("home", {homeContent: homeStartingContent, posts: docs});
  });
});

app.get("/about", (req, res)=> {
  res.render("about", {aboutContent: aboutStartingContent});
});

app.get("/contact", (req, res)=> {
  res.render("contact", {contactContent: contactStartingContent});
});

app.get("/compose", (req, res)=> {
  res.render("compose");
});

app.get("/posts/:Any", (req, res)=> {
  Post.find((err, docs)=> {
    docs.forEach((doc)=> {
      if(_.lowerCase(doc.title)==_.lowerCase(req.params.Any)) {
        res.render("post", {title: doc.title, body: doc.body});
      }
    });
  });
});

app.post("/delete", (req, res)=> {
  Post.findOneAndDelete({title: req.body.checkbox}, (err, doc)=> {
    res.redirect("/");
  });
});

app.post("/compose", (req, res)=> {
  const post=new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  });
  post.save();
  res.redirect("/");
});
