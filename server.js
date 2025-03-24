import express from "express";
import cookieParser from "cookie-parser";
import { bugService } from "./servers/bugService.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => res.send("Hello there"));

//*Read

app.get("/api/bug", (req, res) => {
  bugService
    .query()
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      console.log("err:", err);
      res.status(500).send("Cannot load bugs");
    });
});


//*Save

// app.get('/api/bug/save', (req, res) => {})

//*Get/Read by id

app.get("/api/bug/:bugId", (req, res) => {
  const { bugId } = req.params;
  bugService.getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      console.log("err:", err);
      res.status(500).send("Cannot load bugs");
    });
});

//*Remove

app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params;
    bugService.remove(bugId)
    .then(() => res.send('Bug Removed'))
    .catch((err) => {
      console.log("err:", err);
      res.status(500).send("Cannot remove bugs");
    });  
})




app.listen(3031, () => console.log("Server ready at port 3031"));
