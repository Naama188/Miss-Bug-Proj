import express from "express";
import cookieParser from "cookie-parser";
import { bugService } from "./services/bugService.js";
import { loggerService } from './services/logger.service.js'

const app = express();

// App Configuration
app.use(express.static('public'))
app.use(cookieParser());
app.use(express.json());


//*Read/List/Sorting/Filtering/Paging

app.get('/api/bug', (req, res) => {
    const queryOptions = parseQueryParams(req.query)

	bugService.query(queryOptions)
		.then(bugs => {
			res.send(bugs)
		})
		.catch(err => {
			loggerService.error('Cannot get bugs', err)
			res.status(400).send('Cannot get bugs')
		})
})

function parseQueryParams(queryParams) {
    const filterBy = {
        txt: queryParams.txt || '',
        minSeverity: +queryParams.minSeverity || 0,
        labels: queryParams.labels || [],
    }

    const sortBy = {
        sortField: queryParams.sortField || '',
        sortDir: +queryParams.sortDir || 1,
    }
    
    const pagination = {
        pageIdx: queryParams.pageIdx !== undefined ? +queryParams.pageIdx || 0 : queryParams.pageIdx,
        pageSize: +queryParams.pageSize || 3,
    }

    return { filterBy, sortBy, pagination }
}


//*Get/Read by id

app.get('/api/bug/:bugId', (req, res) => {
	const { bugId } = req.params
	const { visitCountMap = [] } = req.cookies

	if (visitCountMap.length >= 3) return res.status(401).send('Wait for a bit')
	if (!visitCountMap.includes(bugId)) visitCountMap.push(bugId)

	res.cookie('visitCountMap', visitCountMap, { maxAge: 1000 * 10 })
	bugService.getById(bugId)
		.then(bug => res.send(bug))
		.catch(err => {
			loggerService.error('Cannot get bug', err)
			res.status(400).send('Cannot get bug')
		})
})


//*Save/Create/Updeat

app.post('/api/bug', (req, res) => {
	const { title, description, severity, labels } = req.body

    if (!title || severity === undefined) return res.status(400).send('Missing required fields')

	const bug = {
        title,
		description,
		severity: +severity || 1,
        labels: labels || [],
	}

	bugService.save(bug)
		.then(savedBug => {
			res.send(savedBug)
		})
		.catch(err => {
			loggerService.error('Cannot save bug', err)
			res.status(400).send('Cannot save bug')
		})
})

app.put('/api/bug/:bugId', (req, res) => {
	const { title, description, severity, labels, _id } = req.body

    if ( !_id || !title || severity === undefined) return res.status(400).send('Missing required fields')
    const bug = {
		_id,
		title,
		description,
		severity: +severity,
        labels: labels || [],
	}

	bugService.save(bug)
		.then(savedBug => {
			res.send(savedBug)
		})
		.catch(err => {
			loggerService.error('Cannot save bug', err)
			res.status(400).send('Cannot save bug')
		})
})

//*Remove

app.delete('/api/bug/:bugId', (req, res) => {
	const { bugId } = req.params

	bugService.remove(bugId)
		.then(() => {
			loggerService.info(`Bug ${bugId} removed`)
			res.send('Removed!')
		})
		.catch(err => {
			loggerService.error('Cannot get bug', err)
			res.status(400).send('Cannot get bug')
		})
})

const port = 3031
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
