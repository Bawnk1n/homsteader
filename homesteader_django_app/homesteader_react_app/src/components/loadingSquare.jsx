export function LoadingSquare(props) {
  const { unloaded, next, loaded } = props;
  return (
    <div
      className="loadingSquare"
      style={{
        backgroundColor: loaded ? "#600E1F" : next ? "lightgrey" : "white",
      }}
    ></div>
  );
}
