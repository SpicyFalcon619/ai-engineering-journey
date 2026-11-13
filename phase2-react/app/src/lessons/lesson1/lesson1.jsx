// Lesson 1: components and JSX

function greeting() {
  return <h1>Hello, Maruf</h1>;
}

function Profile(){
  return <div>
    <h2>Maruf Hossain</h2>
    <p>United International University</p>
  </div>
}

export default function Lesson1() {
  return (
    <div>
      <greeting/>
      <greeting/>
      <Profile/>
    </div>
  );
}