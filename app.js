var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express(),
expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost:27017/restful_blog_app",{ useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


var blogSchema = new  mongoose.Schema({
    title: String, 
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create(
//     {
//     title: "Red flowers field",
//     image: "https://images.unsplash.com/photo-1557562440-b67d58679232?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "Great place for photography."
//     }
    
//     , function(err, blog){
//         if(err){
//             console.log("an error");
//             console.log(err);
            
//         }
//         else{
//             console.log("Newly Created Campground:");
//             console.log(blog);
//         }
//     });

app.get("/", function(req, res) {
   res.redirect("/blogs"); 
});



app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("index", {blogs: blogs});  
        }
    });
});

app.get("/blogs/new", function(req, res) {
    res.render("new");
});

app.post("/blogs", function(req, res){
    
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log("============");
    console.log(req.body);
    
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log(err);
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res) {
    
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } 
        else{
            res.render("show",{blog: foundBlog});
        }
    });
});

app.get("/blogs/:id/edit", function(req, res) {
   
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log("============");
    console.log(req.body);
  
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } 
        else{
            res.render("edit",{blog: foundBlog});
        }
    });
});

app.put("/blogs/:id", function(req, res){   
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err)
       {
           res.redirect("/blogs");
       }
        else
        {
            res.redirect("/blogs/" + req.params.id);
        }
        
    });
    
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
       if(err)
       {
           res.redirect("/blogs");
       }
       else
       {
           res.redirect("/blogs");
       }
    }); 
});


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started!"); 
});