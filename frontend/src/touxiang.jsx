import MagicPet from './components/MagicPet';

function MyDashboard() {
  return (
    <div>
      <h1>托管中心图鉴</h1>
      {/* 自动生成：ID不同，形象就不同 */}
      <MagicPet studentId="xiaoming_001" score={120} />
      <MagicPet studentId="xiaofang_002" score={45} />
    </div>
  );
}