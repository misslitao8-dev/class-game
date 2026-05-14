import { useEffect, useState } from "react";

const menuList = [
  { icon: "👨‍🎓", title: "学生管理" },
  { icon: "📋", title: "任务管理" },
  { icon: "🎁", title: "奖励分管理" },
  { icon: "📝", title: "日志" },
  { icon: "⚙️", title: "其它" },
];

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState(0);
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentForm, setStudentForm] = useState({
    id: null,
    name: "",
    title: "🌟 新成员",
    avatar: "😀",
    theme: "blue",
    level: 1,
    exp: 0,
    max_exp: 100,
    score: 0,

    stats: {
      chinese: 0,
      math: 0,
      english: 0,
      stamina: 0,
      discipline: 0,
      speed: 0,
      charisma: 0,
    },

    tasks: [],
    buffs: [],
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const studentsPerPage = 20;

  const fetchStudents = async (keyword = "") => {
    try {
      setLoading(true);

      const url = keyword
        ? `http://localhost:3001/api/students?keyword=${encodeURIComponent(keyword)}`
        : "http://localhost:3001/api/students";

      const res = await fetch(url);
      const data = await res.json();

      const list = data?.data || [];

      const parsed = list.map((item) => ({
        ...item,
        stats:
          typeof item.stats === "string"
            ? JSON.parse(item.stats)
            : item.stats || {},
        tasks:
          typeof item.tasks === "string"
            ? JSON.parse(item.tasks)
            : item.tasks || [],
        buffs:
          typeof item.buffs === "string"
            ? JSON.parse(item.buffs)
            : item.buffs || [],
      }));

      setStudents(parsed);
    } catch (error) {
      console.error("获取学生失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeMenu === 0) {
      fetchStudents();
    }
  }, [activeMenu]);

  const totalPages = Math.ceil(students.length / studentsPerPage);

  const currentStudents = students.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const handleDelete = async (id) => {
    const firstConfirm = window.confirm("确定要删除这个学生吗？");

    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      "删除后不可恢复，是否继续？"
    );

    if (!secondConfirm) return;

    try {
      await fetch(`http://localhost:3001/api/students/${id}`, {
        method: "DELETE",
      });

      setStudents((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  const handleEdit = (student) => {
    setStudentForm({
      id: student.id,
      name: student.name || "",
      title: student.title || "",
      avatar: student.avatar || "😀",
      theme: student.theme || "blue",
      level: student.level || 1,
      exp: student.exp || 0,
      max_exp: student.max_exp || 100,
      score: student.score || 0,

      stats: student.stats || {
        chinese: 0,
        math: 0,
        english: 0,
        stamina: 0,
        discipline: 0,
        speed: 0,
        charisma: 0,
      },

      tasks: student.tasks || [],
      buffs: student.buffs || [],
    });

    setIsEditMode(true);
    setShowAddModal(true);
  };

  const handleAddStudent = async () => {
    try {
      const method = isEditMode ? "PUT" : "POST";

      const url = isEditMode
        ? `http://localhost:3001/api/students/${studentForm.id}`
        : "http://localhost:3001/api/students";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentForm),
      });

      const data = await res.json();

      if (isEditMode) {
        setStudents((prev) =>
          prev.map((item) =>
            item.id === studentForm.id
              ? data.data
              : item
          )
        );
      } else {
        setStudents((prev) => [data.data, ...prev]);
      }

      setStudentForm({
        id: null,
        name: "",
        title: "🌟 新成员",
        avatar: "😀",
        theme: "blue",
        level: 1,
        exp: 0,
        max_exp: 100,
        score: 0,

        stats: {
          chinese: 0,
          math: 0,
          english: 0,
          stamina: 0,
          discipline: 0,
          speed: 0,
          charisma: 0,
        },

        tasks: [],
        buffs: [],
      });

      setIsEditMode(false);
      setShowAddModal(false);
    } catch (error) {
      console.error("保存失败:", error);
    }
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
          gap: "16px",
          flexWrap: "wrap",
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

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flex: 1,
            minWidth: "320px",
          }}
        >
          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchStudents(searchKeyword);
              }
            }}
            placeholder="搜索学生姓名或ID"
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              fontSize: "15px",
              outline: "none",
            }}
          />

          <button
            onClick={() => {
              setCurrentPage(1);
              fetchStudents(searchKeyword);
            }}
            style={{
              background: "#0f172a",
              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            搜索
          </button>

          <button
            onClick={() => {
              setSearchKeyword("");
              setCurrentPage(1);
              fetchStudents();
            }}
            style={{
              background: "#e2e8f0",
              color: "#1e293b",
              border: "none",
              padding: "12px 18px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            重置
          </button>
        </div>

        <button
          onClick={() => {
            setIsEditMode(false);

            setStudentForm({
              id: null,
              name: "",
              title: "🌟 新成员",
              avatar: "😀",
              theme: "blue",
              level: 1,
              exp: 0,
              max_exp: 100,
              score: 0,

              stats: {
                chinese: 0,
                math: 0,
                english: 0,
                stamina: 0,
                discipline: 0,
                speed: 0,
                charisma: 0,
              },

              tasks: [],
              buffs: [],
            });

            setShowAddModal(true);
          }}
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
              <th style={{ padding: "16px" }}>等级</th>
              <th style={{ padding: "16px" }}>经验值</th>
              <th style={{ padding: "16px" }}>称号</th>
              <th style={{ padding: "16px" }}>状态</th>
              <th style={{ padding: "16px" }}>操作</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
  <tr>
    <td
      colSpan="7"
      style={{
        padding: "30px",
        textAlign: "center",
      }}
    >
      加载中...
    </td>
  </tr>
) : currentStudents.length === 0 ? (
  <tr>
    <td
      colSpan="7"
      style={{
        padding: "30px",
        textAlign: "center",
      }}
    >
      暂无学生数据
    </td>
  </tr>
) : (
  currentStudents.map((student) => (
              <tr
                key={student.id}
                style={{
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <td style={{ padding: "16px" }}>{student.id}</td>
                <td style={{ padding: "16px" }}>{student.name}</td>
                <td style={{ padding: "16px" }}>
                  Lv.{student.level || 1}
                </td>
                <td style={{ padding: "16px" }}>
                  {student.exp || 0}
                </td>
                <td style={{ padding: "16px" }}>{student.title}</td>
                <td style={{ padding: "16px" }}>
                  {student.theme || "blue"}
                </td>

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
            ))
)}
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

            <p>
              头像：{selectedStudent.avatar}
            </p>

            <p>
              姓名：{selectedStudent.name}
            </p>
            <p>等级：Lv.{selectedStudent.level || 1}</p>
            <p>经验值：{selectedStudent.exp || 0}</p>
            <p>称号：{selectedStudent.title}</p>
            <p>主题：{selectedStudent.theme}</p>
            <p>积分：{selectedStudent.score}</p>

            <div style={{ marginTop: "20px" }}>
              <h3>属性</h3>

              <p>
                语文：
                {selectedStudent.stats?.chinese || 0}
              </p>

              <p>
                数学：
                {selectedStudent.stats?.math || 0}
              </p>

              <p>
                英语：
                {selectedStudent.stats?.english || 0}
              </p>

              <p>
                体力：
                {selectedStudent.stats?.stamina || 0}
              </p>
            </div>

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
              width: "90vw",
              maxWidth: "900px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h2 style={{ margin: 0 }}>
                {isEditMode ? "修改学生" : "添加学生"}
              </h2>

              {isEditMode && (
                <div
                  style={{
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  id: {studentForm.id}
                </div>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                gap: "16px",
                marginTop: "20px",
              }}
            >
              <div>
                <div
                  style={{
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  name - 学生姓名
                </div>

                <input
                  value={studentForm.name}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="学生姓名"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  title - 称号
                </div>
                <input
                  value={studentForm.title}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      title: e.target.value,
                    })
                  }
                  placeholder="称号"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  avatar - 头像
                </div>
                <input
                  value={studentForm.avatar}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      avatar: e.target.value,
                    })
                  }
                  placeholder="头像 Emoji"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  theme - 主题
                </div>
                <select
                  value={studentForm.theme}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      theme: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="blue">blue</option>
                  <option value="pink">pink</option>
                  <option value="purple">purple</option>
                  <option value="green">green</option>
                </select>
              </div>

              <div>
                <div
                  style={{
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  level - 等级
                </div>
                <input
                  type="number"
                  value={studentForm.level}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      level: Number(e.target.value),
                    })
                  }
                  placeholder="等级"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  exp - 当前经验值
                </div>
                <input
                  type="number"
                  value={studentForm.exp}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      exp: Number(e.target.value),
                    })
                  }
                  placeholder="经验值"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  max_exp - 最大经验值
                </div>
                <input
                  type="number"
                  value={studentForm.max_exp}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      max_exp: Number(e.target.value),
                    })
                  }
                  placeholder="最大经验值"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  score - 积分
                </div>
                <input
                  type="number"
                  value={studentForm.score}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      score: Number(e.target.value),
                    })
                  }
                  placeholder="积分"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div
                style={{
                  gridColumn: "1 / -1",
                  marginTop: "10px",
                }}
              >
                <h3 style={{ margin: 0 }}>属性</h3>
              </div>

              {Object.keys(studentForm.stats).map((key) => (
                <div key={key}>
                  <div
                    style={{
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#334155",
                    }}
                  >
                    属性 - {key}
                  </div>

                  <input
                    type="number"
                    value={studentForm.stats[key]}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        stats: {
                          ...studentForm.stats,
                          [key]: Number(e.target.value),
                        },
                      })
                    }
                    placeholder={key}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
            </div>
            </div>
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
                {isEditMode ? "保存修改" : "确认添加"}
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