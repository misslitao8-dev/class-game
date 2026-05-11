import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();

// --- 配置区 ---
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 创建数据库连接池
const dbPromise = open({
    filename: path.resolve('../frontend/center_data.db'),
    driver: sqlite3.Database
});
console.log('DB Path:', path.resolve('../frontend/center_data.db'));
console.log('Exists check:', fs.existsSync(path.resolve('../frontend/center_data.db')));

/**
 * 核心 API：获取学生角色详情
 * 接口地址：GET http://localhost:3001/api/student/:id
 */
app.get('/api/student/:id', async (req, res) => {
    const studentId = req.params.id;

    try {
        const db = await dbPromise;
const rows = await db.all('SELECT * FROM students WHERE id = ?', [studentId]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "查无此人" });
        }

        const data = rows[0];
        console.log("DB row:", data);

        // 【关键逻辑】按照前端组件需求重新格式化数据
        const formattedData = {
            id: data.id,
            name: data.name,
            avatar: data.avatar,
            level: data.level,
            exp: data.exp,
            title: data.title,
            // 将散乱的成绩字段封装进 stats 对象
            stats: data.stats ? JSON.parse(data.stats) : {},
            tasks: data.tasks ? JSON.parse(data.tasks) : [],
            profile: data.profile_desc
        };


        res.json(formattedData);

    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ success: false, message: "数据库连接异常" });
    }
});

/**
 * 核心 API：获取所有学生列表
 * 接口地址：GET http://localhost:3001/api/students
 */
app.get('/api/students', async (req, res) => {
    try {
        const db = await dbPromise;
        const rows = await db.all('SELECT * FROM students');

        const list = rows.map(data => {
            return {
                id: data.id,
                name: data.name,
                avatar: data.avatar,
                level: data.level,
                exp: data.exp,
                title: data.title,

                stats: data.stats ? JSON.parse(data.stats) : {},
                tasks: data.tasks ? JSON.parse(data.tasks) : [],

                profile: data.profile_desc
            };
        });

        res.json({
            success: true,
            data: list
        });

    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ success: false, message: "数据库连接异常" });
    }
});

app.listen(PORT, () => {
    console.log(`✨ 服务端已整洁启动：http://localhost:${PORT}`);
});