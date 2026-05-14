import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dbPath = path.resolve('./center_data.db');

const dbPromise = open({
  filename: dbPath,
  driver: sqlite3.Database,
});

function safeParse(value, defaultValue) {
  try {
    return value ? JSON.parse(value) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function formatStudent(data) {
  return {
    id: data.id,
    name: data.name,
    title: data.title,
    avatar: data.avatar,
    theme: data.theme,
    level: data.level,
    exp: data.exp,
    max_exp: data.max_exp,
    score: data.score || 0,

    stats: safeParse(data.stats, {}),
    tasks: safeParse(data.tasks, []),
    buffs: safeParse(data.buffs, []),
  };
}

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'server running',
  });
});

app.get('/api/students', async (req, res) => {
  try {
    const db = await dbPromise;

    const { keyword } = req.query;

    let rows = [];

    if (keyword && keyword.trim()) {
      rows = await db.all(
        `
        SELECT * FROM students
        WHERE
          name LIKE ?
          OR id = ?
        ORDER BY id DESC
        `,
        [
          `%${keyword}%`,
          Number(keyword) || -1,
        ]
      );
    } else {
      rows = await db.all(
        'SELECT * FROM students ORDER BY id DESC'
      );
    }

    res.json({
      success: true,
      data: rows.map(formatStudent),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: '获取学生失败',
    });
  }
});

app.get('/api/student/:id', async (req, res) => {
  try {
    const db = await dbPromise;

    const row = await db.get(
      'SELECT * FROM students WHERE id = ?',
      [req.params.id]
    );

    if (!row) {
      return res.status(404).json({
        success: false,
        message: '学生不存在',
      });
    }

    res.json({
      success: true,
      data: formatStudent(row),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: '获取学生失败',
    });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const db = await dbPromise;

    const {
      name,
      title,
      avatar,
      theme,
      level,
      exp,
      max_exp,
      score,
      stats,
      tasks,
      buffs,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: '学生姓名不能为空',
      });
    }

    const result = await db.run(
      `
      INSERT INTO students (
        name,
        title,
        avatar,
        theme,
        level,
        exp,
        max_exp,
        score,
        stats,
        tasks,
        buffs
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        title,
        avatar,
        theme,
        level,
        exp,
        max_exp,
        score,
        JSON.stringify(stats || {}),
        JSON.stringify(tasks || []),
        JSON.stringify(buffs || []),
      ]
    );

    const newStudent = await db.get(
      'SELECT * FROM students WHERE id = ?',
      [result.lastID]
    );

    res.json({
      success: true,
      data: formatStudent(newStudent),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: '新增学生失败',
    });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const db = await dbPromise;

    const oldData = await db.get(
      'SELECT * FROM students WHERE id = ?',
      [req.params.id]
    );

    if (!oldData) {
      return res.status(404).json({
        success: false,
        message: '学生不存在',
      });
    }

    const updated = {
      ...oldData,
      ...req.body,
    };

    await db.run(
      `
      UPDATE students
      SET
        name = ?,
        title = ?,
        avatar = ?,
        theme = ?,
        level = ?,
        exp = ?,
        max_exp = ?,
        score = ?,
        stats = ?,
        tasks = ?,
        buffs = ?
      WHERE id = ?
      `,
      [
        updated.name,
        updated.title,
        updated.avatar,
        updated.theme,
        updated.level,
        updated.exp,
        updated.max_exp,
        updated.score,
        JSON.stringify(updated.stats || {}),
        JSON.stringify(updated.tasks || []),
        JSON.stringify(updated.buffs || []),
        req.params.id,
      ]
    );

    const finalData = await db.get(
      'SELECT * FROM students WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      data: formatStudent(finalData),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: '修改学生失败',
    });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const db = await dbPromise;

    await db.run(
      'DELETE FROM students WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: '删除学生失败',
    });
  }
});

app.listen(PORT, () => {
  console.log(`✨ 服务端已启动：http://localhost:${PORT}`);
});