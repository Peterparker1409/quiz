import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mysql from 'mysql2/promise';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'khoa',
    database: 'quiz',
});

// Endpoint để lấy một category theo category_id
app.get('/api/v1/category/:id', async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.id);

    try {
        const [rows] : any = await (await db).execute('SELECT * FROM category WHERE category_id = ?', [categoryId]);
        if (rows.length === 1) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        console.error('MySQL error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint để lấy toàn bộ dữ liệu về category
app.get('/api/v1/category', async (req: Request, res: Response) => {
    try {
        const [rows] = await (await db).query('SELECT * FROM category');
        res.json(rows);
    } catch (error) {
        console.error('MySQL error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/v1/category', async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        const [result] : any = await (await db).execute('INSERT INTO category (name) VALUES (?)', [name]);
        res.status(201).json({ id: result.insertId, name });
    } catch (error) {
        console.error('MySQL error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/v1/questions/:id', async (req: Request, res: Response) => {
    const questionId = parseInt(req.params.id);

    try {
        const [rows] : any = await (await db).execute('SELECT * FROM question WHERE question_id = ?', [questionId]);
        if (rows.length === 1) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Question not found' });
        }
    } catch (error) {
        console.error('MySQL error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/v1/questions/:id/answers', async (req: Request, res: Response) => {
    const questionId = parseInt(req.params.id);

    try {
        const [questions] : any = await (await db).execute('SELECT * FROM question WHERE question_id = ?', [questionId]);
        if (questions.length === 1) {
            const question = questions[0];
            const [answers] = await (await db).execute('SELECT * FROM answers WHERE question_id = ?', [questionId]);
            question.answers = answers;
            res.json(question);
        } else {
            res.status(404).json({ error: 'Question not found' });
        }
    } catch (error) {
        console.error('MySQL error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint để lấy về toàn bộ questions
app.get('/api/v1/questions', async (req: Request, res: Response) => {
    try {
        const [rows] = await (await db).query('SELECT * FROM question');
        res.json(rows);
    } catch (error) {
        console.error('MySQL error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/v1/questions', async (req: Request, res: Response) => {
    const category = req.query.category;
    const level = req.query.level;
    const limit = req.query.limit;

    let query = 'SELECT * FROM question WHERE 1=1';
    if (category) query += ' AND category_id = ?';
    if (level) query += ' AND level = ?';
    if (limit) query += ' LIMIT ?';

    const queryParams = [category, level, limit].filter(param => param !== undefined);

    try {
        const [rows] = await (await db).execute(query, queryParams);
        res.json(rows);
    } catch (error) {
        console.error('MySQL error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint để thêm mới một question
app.post('/api/v1/questions', async (req: Request, res: Response) => {
    const { category_id, content, level, answers } = req.body;

    try {
        const [result] : any = await (await db).execute('INSERT INTO question (category_id, content, level) VALUES (?, ?, ?)', [category_id, content, level]);
        const questionId : number = result.insertId;

        // Thêm các câu trả lời vào bảng answers
        for (const answer of answers) {
            await (await db).execute('INSERT INTO answers (question_id, content, is_correct) VALUES (?, ?, ?)', [questionId, answer.content, answer.is_correct]);
        }

        res.status(201).json({ id: questionId, category_id, content, level, answers });
    } catch (error) {
        console.error('MySQL error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
