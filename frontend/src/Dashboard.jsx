import { useEffect, useState } from "react";

const menuList = [
  { icon: "👨‍🎓", title: "学生管理" },
  { icon: "📋", title: "任务管理" },
  { icon: "🎁", title: "奖励分管理" },
  { icon: "📝", title: "日志" },
  { icon: "⚙️", title: "其它" },
];

const mockStudents = Array.from({ length: 48 }, (_, index) => ({
  id: index + 1,
  name: `学生${index + 1}`,
  grade: `${Math.floor(index / 10) + 1}年级`,
  score: Math.floor(Math.random() * 1000),
  title: ["新手冒险家", "勇者", "学霸", "篮球达人"][index % 4],
  status: index % 2 === 0 ? "在线" : "离线",
}));

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState(0);
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");

  const studentsPerPage = 20;

  useEffect(() => {
    if (activeMenu === 0) {
      // TODO: 后续替换成真实接口
      setStudents(mockStudents);
    }
  }, [activeMenu]);

  const totalPages = Math.ceil(students.length / studentsPerPage);

  const currentStudents = students.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const handleDelete = (id) => {
    const firstConfirm = window.confirm("确定要删除这个学生吗？");

    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      "删除后不可恢复，是否继续？"
    );

    if (!secondConfirm) return;

    setStudents((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (student) => {
    const newName = prompt("修改学生姓名", student.name);

    if (!newName) return;

    setStudents((prev) =>
      prev.map((item) =>
        item.id === student.id
          ? {
              ...item,
              name: newName,
            }
          : item
      )
    );
  };

  const handleAddStudent = () => {
    if (!newStudentName.trim()) return;

    const newStudent = {
      id: Date.now(),
      name: newStudentName,
      grade: "1年级",
      score: 0,
      title: "新成员",
      status: "在线",
    };

    setStudents((prev) => [newStudent, ...prev]);
    setNewStudentName("");
    setShowAddModal(false);
  };
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f4f7fb",
      }}
    >
      {/* 左侧边栏 */}
      <div
        style={{
          width: "260px",
          background: "linear-gradient(180deg,#081225,#0d1b3d)",
          color: "white",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          {/* Logo */}
          <div style={{ marginBottom: "50px" }}>
            <h1
              style={{
                fontSize: "30px",
                margin: 0,
                fontWeight: "bold",
              }}
            >
              🎮 班级系统
            </h1>

            <p
              style={{
                color: "#94a3b8",
                marginTop: "10px",
                fontSize: "14px",
              }}
            >
              管理 · 成长 · 激励
            </p>
          </div>

          {/* 菜单 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {menuList.map((item, index) => (
              <div
                key={index}
                onClick={() => setActiveMenu(index)}
                style={{
                  background:
                    activeMenu === index
                      ? "linear-gradient(90deg,#2563eb,#3b82f6)"
                      : "transparent",
                  padding: "18px 20px",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </div>

                <span
                  style={{
                    color: "#cbd5e1",
                    fontSize: "20px",
                  }}
                >
                  ›
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 底部 */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "20px",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "18px",
              }}
            >
              <span>⚙️</span>
              <span>系统设置</span>
            </div>

            <span style={{ color: "#cbd5e1" }}>›</span>
          </div>
        </div>
      </div>

      {/* 右侧内容区 */}
      <div
        style={{
          flex: 1,
          padding: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            marginBottom: "20px",
            color: "#1e293b",
          }}
        >
          {menuList[activeMenu].title}
        </h1>

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "40px",
            minHeight: "500px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <>
  {activeMenu === 0 ? (
    <div>
      {/* 顶部工具栏 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#1e293b",
          }}
        >
          学生列表
        </h2>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          + 添加学生
        </button>
      </div>

      {/* 表格 */}
      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f1f5f9",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "16px" }}>ID</th>
              <th style={{ padding: "16px" }}>姓名</th>
              <th style={{ padding: "16px" }}>年级</th>
              <th style={{ padding: "16px" }}>奖励分</th>
              <th style={{ padding: "16px" }}>称号</th>
              <th style={{ padding: "16px" }}>状态</th>
              <th style={{ padding: "16px" }}>操作</th>
            </tr>
          </thead>

          <tbody>
            {currentStudents.map((student) => (
              <tr
                key={student.id}
                style={{
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <td style={{ padding: "16px" }}>{student.id}</td>
                <td style={{ padding: "16px" }}>{student.name}</td>
                <td style={{ padding: "16px" }}>{student.grade}</td>
                <td style={{ padding: "16px" }}>{student.score}</td>
                <td style={{ padding: "16px" }}>{student.title}</td>
                <td style={{ padding: "16px" }}>{student.status}</td>

                <td
                  style={{
                    padding: "16px",
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => setSelectedStudent(student)}
                    style={{
                      padding: "8px 14px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#0ea5e9",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    详情
                  </button>

                  <button
                    onClick={() => handleEdit(student)}
                    style={{
                      padding: "8px 14px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#f59e0b",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    修改
                  </button>

                  <button
                    onClick={() => handleDelete(student.id)}
                    style={{
                      padding: "8px 14px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#ef4444",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background:
                currentPage === index + 1 ? "#2563eb" : "#e2e8f0",
              color: currentPage === index + 1 ? "white" : "#1e293b",
              fontWeight: "600",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* 详情弹窗 */}
      {selectedStudent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              width: "420px",
            }}
          >
            <h2>学生详情</h2>

            <p>姓名：{selectedStudent.name}</p>
            <p>年级：{selectedStudent.grade}</p>
            <p>奖励分：{selectedStudent.score}</p>
            <p>称号：{selectedStudent.title}</p>
            <p>状态：{selectedStudent.status}</p>

            <button
              onClick={() => setSelectedStudent(null)}
              style={{
                marginTop: "20px",
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "12px",
                cursor: "pointer",
              }}
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 添加学生弹窗 */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              width: "420px",
            }}
          >
            <h2>添加学生</h2>

            <input
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="请输入学生姓名"
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "20px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "25px",
              }}
            >
              <button
                onClick={handleAddStudent}
                style={{
                  flex: 1,
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "14px",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                确认添加
              </button>

              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  background: "#e2e8f0",
                  color: "#1e293b",
                  border: "none",
                  padding: "14px",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div>
      当前正在查看：{menuList[activeMenu].title}
    </div>
  )}
</>
        </div>
      </div>
    </div>
  );
}