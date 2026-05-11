import React, { useState } from 'react';

// 这里定义后台管理的主组件
export default function AdminPage({ students, onRefresh }) {
  const [msg, setMsg] = useState('');

  // 修改数据的通用函数
  const updateStudent = async (id, field, value) => {
    try {
      const response = await fetch('http://localhost:3001/api/update-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, field, value })
      });
      const result = await response.json();
      if (result.success) {
        setMsg('✅ 修改成功');
        onRefresh(); // 成功后刷新数据
        setTimeout(() => setMsg(''), 2000);
      }
    } catch (err) {
      console.error("更新失败:", err);
    }
  };

  return (
    <div style={styles.adminContainer}>
      <div style={styles.header}>
        <h2>🏫 托管中心后台管理系统</h2>
        {msg && <span style={styles.toast}>{msg}</span>}
      </div>

      <table style={styles.table}>
        <thead>
          <tr style={styles.thRow}>
            <th>学生</th>
            <th>当前等级</th>
            <th>经验值 (EXP)</th>
            <th>属性操作</th>
            <th>任务管理</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id} style={styles.tr}>
              <td>{s.avatar} <strong>{s.name}</strong></td>
              <td>Lv.{s.level}</td>
              <td>{s.exp} / {s.max_exp}</td>
              <td>
                <button onClick={() => updateStudent(s.id, 'exp', s.exp + 10)} style={styles.btn}>+10 EXP</button>
                <button onClick={() => updateStudent(s.id, 'level', s.level + 1)} style={styles.btn}>直接升级</button>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {s.tasks.map((task, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        const newTasks = [...s.tasks];
                        newTasks[idx].completed = !newTasks[idx].completed;
                        updateStudent(s.id, 'tasks', newTasks);
                      }}
                      style={{ 
                        ...styles.btnTask, 
                        background: task.completed ? '#C4EBD0' : '#F8C8D6' 
                      }}
                    >
                      {task.name}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 简单的行内样式
const styles = {
  adminContainer: { padding: '30px', background: '#fff', borderRadius: '20px', minHeight: '400px' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' },
  toast: { color: '#4CAF50', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thRow: { borderBottom: '2px solid #F4E8DC', textAlign: 'left' },
  tr: { borderBottom: '1px solid #eee' },
  btn: { padding: '6px 12px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', marginRight: '5px' },
  btnTask: { padding: '4px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px' }
};