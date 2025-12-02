
const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Header = ({ name }) => {
  return <h1>{name}</h1>
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => <Part key={part.id} part={part} />)}
    </div>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <TotalExercises parts={course.parts} />
    </div>
  )
}

const TotalExercises = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <p>
      total of {total} exercises
    </p>
  )
}

const App = (props) => {
  const {courses} = props

  return (<>
  {courses.map (course => <Course key={course.id} course={course} />)}
  </>
  )
}

export default App