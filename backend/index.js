const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let students = [];

// 经验计算
function expRequired(level) {
  return 100 + level * 50;
}

// 获取学生列表
app.get("/students", (req, res) => {
  res.json(students);
});

// 添加学生
app.post("/students", (req, res) => {
  const { name } = req.body;

  const student = {
    id: Date.now(),
    name,
    level: 1,
    exp: 0
  };

  students.push(student);
  res.json(student);
});

// 增加经验
app.post("/add-exp", (req, res) => {
  const { id, exp } = req.body;

  const student = students.find(s => s.id === id);
  if (!student) return res.status(404).send("Not found");

  student.exp += exp;

  // 升级逻辑
  while (student.exp >= expRequired(student.level)) {
    student.exp -= expRequired(student.level);
    student.level++;
  }

  res.json(student);
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});