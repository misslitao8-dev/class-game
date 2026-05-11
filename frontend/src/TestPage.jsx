import React, { useState, useEffect } from 'react';

const TestPage = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 测试函数：获取 ID 为 1 的学生数据
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/student/1');
            if (!response.ok) throw new Error('无法连接到服务器或数据不存在');
            const data = await response.json();
            setStudent(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            padding: '40px', 
            backgroundColor: '#FDFCF0', // 极浅黄奶底色
            minHeight: '100vh',
            fontFamily: '"Microsoft YaHei", sans-serif'
        }}>
            <h1 style={{ color: '#FFB7CE' }}>🌸 连通性测试页面</h1>
            
            <button 
                onClick={fetchData}
                style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: '#B2E2F2', // 马卡龙蓝
                    border: 'none',
                    borderRadius: '50px',
                    color: '#555',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                    marginBottom: '20px'
                }}
            >
                {loading ? '正在召唤数据...' : '从数据库读取 1号学生'}
            </button>

            {error && <p style={{ color: '#FF9AA2' }}>❌ 错误：{error}</p>}

            {student && (
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    animation: 'fadeIn 0.5s ease'
                }}>
                    {/* 1. 原始 JSON 测试区 */}
                    <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '20px' }}>
                        <h3>📡 后端原始返回 (JSON)</h3>
                        <pre style={{ fontSize: '12px', color: '#888' }}>
                            {JSON.stringify(student, null, 2)}
                        </pre>
                    </div>

                    {/* 2. 简易展示区 (验证 stats 对象是否可用) */}
                    <div style={{ 
                        flex: 1, 
                        background: 'linear-gradient(135deg, #FFB7CE 0%, #FF9AA2 100%)', 
                        padding: '30px', 
                        borderRadius: '30px',
                        color: 'white',
                        boxShadow: '0 10px 20px rgba(255, 183, 206, 0.4)'
                    }}>
                        <h2 style={{ margin: '0 0 10px 0' }}>{student.name}</h2>
                        <p style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: '20px', display: 'inline-block' }}>
                            Lv.{student.level} - {student.title}
                        </p>
                        
                        <div style={{ marginTop: '20px' }}>
                            <p>📊 战力数值验证：</p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>📚 语文：{student.stats.chinese}</li>
                                <li>🧮 数学：{student.stats.math}</li>
                                <li>⚡ 速度：{student.stats.speed}</li>
                            </ul>
                        </div>
                        
                        <p style={{ marginTop: '20px', fontSize: '14px', fontStyle: 'italic' }}>
                            "{student.profile}"
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestPage;