export function CountdownSquare(props) {
  return (
    <div
      className="countdownSquare"
      style={{
        width: props.width,
        backgroundColor: props.done ? "#600E1F" : "white",
        // borderRight: props.done ? "1px solid black" : "",
      }}
    ></div>
  );
}
