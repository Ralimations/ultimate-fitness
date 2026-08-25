
import { useAppState } from '../context/AppStateContext';

export function Dashboard() {
  const { userStats, toggleSocialEvent, getTodayTotalCalories } = useAppState();

  const caloriesConsumed = getTodayTotalCalories();
  const goal = userStats.socialEventMode 
    ? userStats.dailyCalorieGoal + userStats.bufferedCalories
    : userStats.dailyCalorieGoal;

  const progress = Math.min((caloriesConsumed / goal) * 100, 100);
  
  // Calculate days until deadline
  const today = new Date();
  const deadline = new Date(userStats.deadlineDate);
  const diffTime = Math.abs(deadline.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  return (
    <div className="dashboard-container">
      <div className="header-row">
        <h2>Dashboard</h2>
        <div className="streak-badge">
          🔥 {userStats.streakCount} Day Streak
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card primary">
          <span className="stat-label">Weight</span>
          <span className="stat-value">{userStats.currentWeight} kg</span>
          <span className="stat-sub">{diffDays} days to goal</span>
        </div>

        <div className="stat-card toggle-card">
          <span className="stat-label">Social Event</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={userStats.socialEventMode} 
              onChange={toggleSocialEvent}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="calorie-tracker">
        <div className="calorie-header">
          <span>Calories Today</span>
          <span>{caloriesConsumed} / {goal}</span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className={`progress-bar-fill ${progress > 100 ? 'over-limit' : ''}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
