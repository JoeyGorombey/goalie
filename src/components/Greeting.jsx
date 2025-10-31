import './Greeting.css'

function Greeting({ name }) {
  return (
    <div className="greeting">
      <h2>Welcome back, {name}! 👋</h2>
      <p>Here are your goals</p>
    </div>
  )
}

export default Greeting

