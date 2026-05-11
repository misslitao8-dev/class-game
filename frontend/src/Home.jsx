import React, { useEffect, useState } from "react";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#F7F8FA,#EEF2FF)",
    padding: "20px",
    fontFamily: "Arial",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  },
  hero: {
    gridColumn: "span 2",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  avatar: {
    fontSize: "64px",
    background: "#f3f4f6",
    borderRadius: "16px",
    width: "90px",
    height: "90px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: "22px",
    fontWeight: "bold",
  },
  level: {
    color: "#666",
  },
  badge: {
    display: "inline-block",
    marginTop: "6px",
    padding: "4px 10px",
    background: "#EEF2FF",
    borderRadius: "999px",
    fontSize: "12px",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "10px",
    marginTop: "10px",
  },
  statBox: {
    background: "#f9fafb",
    padding: "10px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "12px",
  },
  taskItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },
  progress: {
    height: "10px",
    background: "#eee",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "8px",
  },
  bar: {
    height: "100%",
    background: "#6366f1",
  }
};

export default function Home() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/students") // 如果你后端已支持列表，可改为 /api/students
      .then(res => res.json())
      .then(data => {
        const list = data?.data;

        const parsed = list.map(item => {
          // parse stats
          if (item?.stats && typeof item.stats === "string") {
            try {
              item.stats = JSON.parse(item.stats);
            } catch (e) {
              console.error("stats JSON解析失败:", e);
            }
          }

          // parse tasks
          if (item?.tasks && typeof item.tasks === "string") {
            try {
              item.tasks = JSON.parse(item.tasks);
            } catch (e) {
              console.error("tasks JSON解析失败:", e);
            }
          }

          return item;
        });

        setStudents(parsed);
        setLoading(false);
      })
      .catch(err => {
        console.error("加载失败:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 20 }}>加载中...</div>;
  if (!students.length) return <div style={{ padding: 20 }}>暂无数据</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {students.map((student, index) => {
          const progress = (student.exp / student.max_exp) * 100;

          return (
            <div key={index} style={{ ...styles.card, gridColumn: "span 2" }}>

              {/* HERO */}
              <div style={{ ...styles.hero, marginBottom: 20 }}>
                <div style={styles.avatar}>{student.avatar}</div>
                <div>
                  <div style={styles.name}>{student.name}</div>
                  <div style={styles.level}>LV.{student.level}</div>
                  <div style={styles.badge}>{student.title}</div>

                  <div style={styles.progress}>
                    <div style={{ ...styles.bar, width: progress + "%" }}></div>
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div style={{ marginTop: 10 }}>
                <h3>📊 属性</h3>
                <div style={styles.statGrid}>
                  {student.stats && Object.entries(student.stats).map(([k, v]) => (
                    <div key={k} style={styles.statBox}>
                      {k}<br />
                      <b>{v}</b>
                    </div>
                  ))}
                </div>
              </div>

              {/* TASKS */}
              <div style={{ marginTop: 20 }}>
                <h3>📌 今日任务</h3>
                {student.tasks && student.tasks.map((t, i) => (
                  <div key={i} style={styles.taskItem}>
                    <span>{t.name}</span>
                    <span>{t.completed ? "✅" : "⏳"}</span>
                  </div>
                ))}
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}
