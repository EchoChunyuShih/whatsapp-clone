import { Circle } from "better-react-spinkit";

const Loading = () => {
  const whatsappIcon =
    "http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png";
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <img
          src={whatsappIcon}
          alt=""
          height={200}
          style={{ marginButton: 10 }}
        />
        <Circle color="#3CBC28" size={60} />
      </div>
    </center>
  );
};

export default Loading;
