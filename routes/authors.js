const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

//All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {};
    if(req.query.name != null && req.query.name !== "") {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try{
        const authors = await Author.find(searchOptions);
        if(req.isAuthenticated())
            res.render('authors/index', {
                uName: req.user.uName,
                authors: authors,
                searchOptions: req.query
            });
        else
            res.render('authors/index', {
                authors: authors,
                searchOptions: req.query
            });
    } catch {
        res.redirect('/');
    }
});

//New Autor Route
router.get('/new', (req, res) => {
    if(req.isAuthenticated())
        res.render('authors/new', {uName: req.user.uName, author: new Author()});
    else    
        res.render('authors/new', { author: new Author()});
});

//Create Author Route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    });
    try {
        const newAuthor = await author.save();
        res.redirect(`authors/${newAuthor.id}`);
    } catch {
        if(req.isAuthenticated())
            res.render('authors/new', {
                uName: req.user.uName,
                author: author,
                errorMessage: 'Error creating Author'
            });
        else
            res.render('authors/new', {
                author: author,
                errorMessage: 'Error creating Author'
            });
    }
});

//should be made after /new, otherwise, it'll think authors/new is an ID instead of a page..woraround? Use authors/u/ID (personal challenge)
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: author.id }).limit(6).exec();
        if(req.isAuthenticated())
            res.render('authors/show', {
                uName: req.user.uName,
                author: author,
                booksByAuthor: books
            });
        else
            res.render('authors/show', {
                author: author,
                booksByAuthor: books
            });
    } catch {
        res.redirect('/');
    }
})

//using rest principles
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if(req.isAuthenticated())
            res.render('authors/edit', { uName: req.user.uName, author: author });
        else               
            res.render('authors/edit', { author: author });
    } catch {
        res.redirect('/authors');
    }
})

//put is essenitially telling us, it's gonna be the edit route
router.put('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);
    } catch {
        if(author == null) {
            res.redirect('/');
        } else {
            if(req.isAuthenticated())
                res.render('authors/edit', {
                    uName: req.user.uName,
                    author: author,
                    errorMessage: 'Error updating Author'
                });
            else
                res.render('authors/edit', {
                    author: author,
                    errorMessage: 'Error updating Author'
                });
        }
    }
})

router.delete('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        res.redirect('/authors');
    } catch {
        if(author == null) {
            res.redirect('/');
        } else {
            res.redirect(`/authors/${author.id}`);
        }
    }
})




module.exports = router;