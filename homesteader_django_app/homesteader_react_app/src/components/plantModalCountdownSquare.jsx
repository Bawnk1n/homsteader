import PropTypes from "prop-types";

CountdownSquare.propTypes = {
  width: PropTypes.number,
  done: PropTypes.bool,
};

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
