import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const goodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    console.log("Good clicked:", updatedGood)
  }
  const [neutral, setNeutral] = useState(0)
  const neutClick = () => {
    const updatedNeut = neutral + 1
    setNeutral(updatedNeut)
    console.log("Neut clicked:", updatedNeut)
  }
  const [bad, setBad] = useState(0)
  const badClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    console.log("Bad clicked:", updatedBad)
  }

  const Statistics = (props) => {
    const {good, neutral, bad} = props
    const all = good + neutral + bad
    const positive = good / all
    const average = (good - bad)/all

    if (all === 0) {
      return (
        <div>
          <h1>Statistics</h1>
          <p>No feedback given</p>
        </div>
      )
    }
    return (
      <div>
        <h1>Statistics</h1>
        <table>
          <tbody>
            <StatisticLine text="Good" value={good} />
            <StatisticLine text="Neutral" value={neutral} />
            <StatisticLine text="Bad" value={bad} />
            <StatisticLine text="All" value={all} />
            <StatisticLine text="Average" value={average} />
            <StatisticLine text="Positive" value={`${positive} %`} />
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <>
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={goodClick} text="Good" />
      <Button handleClick={neutClick} text="Neutral" />
      <Button handleClick={badClick} text="Bad" />
    </div>
    <div>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  </>
  )
  
}

export default App