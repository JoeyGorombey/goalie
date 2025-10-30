import GoalCard from './GoalCard.jsx'
import './GoalList.css'

function GoalList({ goals }) {
  return (
    <div className="goal-list">
      {goals.map(goal => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  )
}

export default GoalList

