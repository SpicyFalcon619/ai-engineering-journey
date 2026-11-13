// Lesson 3: lists

const names = ["Aisha", "Rahim", "Karim"];

function NameList() {
  return (
    <ul>
      {names.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}

export default function Lesson3() {
  return (
    <div>
      <NameList />
    </div>
  );
}
