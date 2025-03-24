import { utilService } from "./util.service.js"

export const bugService = {
    query
}

const bugs = utilService.readJsonFile('data/bugs.json')

function query () {
    return Promise.resolve(bugs)
}