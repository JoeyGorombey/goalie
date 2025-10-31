import NavBar from '../components/NavBar.jsx'
import './GoalieWizard.css'

function GoalieWizard() {
  return (
    <div className="goalie-wizard">
      <NavBar />
      <div className="wizard-container">
        <div className="wizard-header">
          <h1>🧙‍♂️ Goalie Wizard</h1>
          <p className="wizard-subtitle">Let's create the perfect goal together!</p>
        </div>

        <div className="wizard-content">
          <div className="wizard-card">
            <h2>Step 1: Define Your Goal</h2>
            <p>What do you want to achieve? Be specific and clear about your objective.</p>
            <input type="text" placeholder="e.g., Learn to play guitar" className="wizard-input" />
          </div>

          <div className="wizard-card">
            <h2>Step 2: Break It Down</h2>
            <p>Break your goal into smaller, manageable milestones. Each milestone should be actionable.</p>
            <textarea 
              placeholder="Enter milestones, one per line..."
              className="wizard-textarea"
              rows="6"
            />
          </div>

          <div className="wizard-card">
            <h2>Step 3: Set a Timeline</h2>
            <p>When do you want to achieve this goal? Set a realistic deadline.</p>
            <input type="date" className="wizard-input" />
          </div>

          <div className="wizard-actions">
            <button className="wizard-btn wizard-btn-primary">
              ✨ Create My Goal
            </button>
            <button className="wizard-btn wizard-btn-secondary">
              Save as Draft
            </button>
          </div>
        </div>

        <div className="wizard-tips">
          <h3>💡 Pro Tips</h3>
          <ul>
            <li>Start with small, achievable milestones</li>
            <li>Be specific about what success looks like</li>
            <li>Set realistic deadlines</li>
            <li>Review and adjust your goals regularly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default GoalieWizard
