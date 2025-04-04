import express from "express";
import cookieParser from "cookie-parser";
import { bugService } from "./servers/bugService.js";
import { loggerService } from './servers/logger.service.js'

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
        loggerService.error('Cannot get bugs', err);
      res.status(500).send("Cannot load bugs");
    });
});


//*Save
app.get('/api/bug/save', (req, res) => {

    loggerService.debug('req.query', req.query)

    const { title, description, severity, _id } = req.query
    console.log('req.query', req.query)
    const bug = {
        _id,
        title,
        description,
        severity: +severity,
    }

    bugService.save(bug).then((savedBug) => {
        res.send(savedBug)
    }).catch((err) => {
        loggerService.error('Cannot save bug', err)
        res.status(400).send('Cannot save bug')
    })
})


// app.get('/api/bug/save', (req, res) => {})

//*Get/Read by id

app.get("/api/bug/:bugId", (req, res) => {
  const { bugId } = req.params;
  bugService.getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
        loggerService.error('Cannot get bug', err);
      res.status(500).send("Cannot load bugs");
    });
});

//*Remove

app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params;
    bugService.remove(bugId)
    .then(() => res.send('Bug Removed'))
    .catch((err) => {
        loggerService.error('Cannot get bug', err);
      res.status(500).send("Cannot remove bugs");
    });  
})


const port = 3031
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
