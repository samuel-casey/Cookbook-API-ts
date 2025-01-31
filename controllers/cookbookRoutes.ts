import express = require("express");
const router: express.Router = express.Router();
const Cookbook = require('../models/Cookbook');
const {ICookbook} = require('../models/interfaces')

// MONGO ACTIONS (HELPER FUNCTIONS FOR ROUTES)

// find all cookbooks
const index = () => {
    return Cookbook.find()
}

// find cookbook by title
const show = (cookbookTitle?: string, yearPublished?: number) => {
    if (cookbookTitle && yearPublished) {
        return Cookbook.find({title: cookbookTitle, yearPublished: yearPublished})
    } else if (cookbookTitle) {
        return Cookbook.find({title: cookbookTitle})
    } else {
        return Cookbook.find({yearPublished: yearPublished})
    }
}

// post a new cookbook to the DB 
const create = (newCookbook: typeof ICookbook) => {
    return Cookbook.create({title: newCookbook.title, yearPublished: newCookbook.yearPublished})
}

// update a cookbook by title
const update = (title: string, newTitle: string) => {
    return Cookbook.findOneAndUpdate({title: title}, { $set: {title: newTitle} }, {new: true, useFindAndModify: false})
}

// destroy a cookbook by title
const destroy = (title: string) => {
    return Cookbook.findOneAndDelete({title: title}, { useFindAndModify: false})
}

// Write the route to list all cookbooks
router.get('/', async (req: express.Request, res: express.Response) => {
    try {
        const allCookbooks = await index()
        res.json({
            status: 200,
            message: "ok",
            data: allCookbooks
        })
        console.log(allCookbooks)
    } catch (err) {
        console.log(err)
    }
})


// Write the route to get cookbook by title
// Write the route to get cookbook by year published
// ** this route returns the cookbook based on title AND/OR year depending on what's passed in the request body **
router.get('/book/', async (req: express.Request, res: express.Response) => {
    if (req.body.title && req.body.yearPublished === undefined) {
    try {
        const cookbook = await show(req.body.title.toLowerCase())
        res.json({
            status: 200,
            message: "ok",
            data: cookbook
        })
        console.log(cookbook)
    } catch (err) {
        console.log(err)
    }
    } else if (req.body.title === undefined && req.body.yearPublished) {
        try {
            const cookbook = await show(req.body.title, req.body.yearPublished)
            res.json({
                status: 200,
                message: "ok",
                data: cookbook
            })
            console.log(cookbook)
        } catch (err) {
            console.log(err)
        }
    } else {
        try {
            const cookbook = await show(undefined, req.body.yearPublished)
            res.json({
                status: 200,
                message: "ok",
                data: cookbook
            })
            console.log(cookbook)
        } catch (err) {
            console.log(err)
        }
    }
})


// Write the route to create a cookbook
router.post('/', async (req: express.Request, res: express.Response) => {
    try {
        console.log(req.body)
        const newCookbook = await create(req.body)
        res.json({
            status: 200,
            message: "ok",
            data: newCookbook
        })
        console.log(newCookbook)
    } catch (err) {
        console.log(err)
    }
})

// Write the route to update a cookbook (find by title)

router.put('/books/:cookbookTitle', async (req: express.Request, res: express.Response) => {
    try {
        const updatedCookbook = await update(req.params.cookbookTitle, req.body.newTitle)
        res.json({
            status: 200,
            message: "ok",
            data: updatedCookbook
        })
    } catch (err) {
        console.log(err)
    }
})


// Write the route to delete the cookbook by title
router.delete('/books/:cookbookTitle', async (req: express.Request, res: express.Response) => {
    try {
        const deletedCookbook = await destroy(req.params.cookbookTitle)
        res.json({
            status: 200,
            message: "ok",
            data: deletedCookbook
        })
    } catch (err) {
        console.log(err)
    }
})


module.exports = router;
