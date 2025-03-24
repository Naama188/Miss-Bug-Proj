import { utilService } from "./util.service.js"

export const bugService = {
    query,
    getById
}

const bugs = utilService.readJsonFile('data/bugs.json')

function query () {
    return Promise.resolve(bugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if(!bug) return Promise.reject('Cannot find bug -' + bugId)
        return Promise.resolve(bug)
}