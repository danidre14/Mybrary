const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

//All Books Route
router.get('/', async (req, res) => {
    let query = Book.find();
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if (req.query.author != null && req.query.author != '') {
        //query = query.eq('author', new RegExp(req.query.author, 'i'));
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore);
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter);
    }
    try {
        const books = await query.exec();

        if(req.isAuthenticated()) 
            res.render('books/index', {
                uName: req.user.uName,
                books: books,
                searchOptions: req.query
            });
        else
            res.render('books/index', {
            books: books,
            searchOptions: req.query
            });
    } catch (e) {
        res.send(e);
        console.error(e)
        //res.redirect('/');
    }
});

//New Book Route
router.get('/new', async (req, res) => {
    renderNewPage(req, res, new Book());
});

//Create Book Route
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    });
    saveCover(book, req.body.cover);

    try {
        const newBook = await book.save();
        res.redirect(`books/${newBook.id}`);
    } catch {
        renderNewPage(req, res, book, true);
    }
});

//Show Book Route
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
                                .populate('author')
                                .exec();
        if(req.isAuthenticated())
            res.render('books/show', {uName: req.user.uName, book: book });
        else
            res.render('books/show', { book: book });
    } catch {
        res.redirect('/');
    }
});

//Edit Book Route
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        renderEditPage(req, res, book);
    } catch {
        res.redirect('/');
    }
});

//Update Book Route
router.put('/:id', async (req, res) => {
    let book;

    try {
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author;
        book.publishDate = new Date(req.body.publishDate);
        book.pageCount = req.body.pageCount;
        book.description = req.body.description;
        if(req.body.cover != null && req.body.cover !== '') {
            saveCover(book, req.body.cover);
        }
        await book.save();
        res.redirect(`/books/${book.id}`);
    } catch {
        if(book != null) {
            renderEditPage(req, res, book, true);
        } else {
            res.redirect('/');
        }
        
    }
});

//Delete Book Page
router.delete('/:id', async (req, res) => {
    let book;
    try {
        book = await Book.findById(req.params.id);
        await book.remove();
        res.redirect('/books');
    } catch {
        if (book != null) { 
            if(req.isAuthenticated())
                res.render('books/show', {
                    uName: req.user.uName,
                    book: book,
                errorMessage: 'Could not remove book'
                });
            else
                res.render('books/show', {
                book: book,
                errorMessage: 'Could not remove book'
                });
        } else {
            res.redirect('/');
        }
    }
});

async function renderNewPage(req, res, book, hasError = false) {
    renderFormPage(req, res, book, 'new', hasError);
}

async function renderEditPage(req, res, book, hasError = false) {
    renderFormPage(req, res, book, 'edit', hasError);
}

async function renderFormPage(req, res, book, form, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        };
        if(hasError) {
            if(form === 'edit') {
                params.errorMessage = "Error Updating Book";
            } else {
                params.errorMessage = "Error Creating Book";
            }
        }

        if(req.isAuthenticated())
            params.uName =  req.user.uName,
    
        res.render(`books/${form}`, params);
    } catch {
        res.redirect('/books');
    }
}

function saveCover(book, coverEncoded) {
    if (coverEncoded == null || coverEncoded == '') return;
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }
}

module.exports = router;