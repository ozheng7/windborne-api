import { useState, useEffect } from "react";
import Globe from "react-globe.gl";

const BalloonGlobe = () => {
  const [points, setPoints] = useState([]);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedBalloon, setSelectedBalloon] = useState(null);

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}balloons/${selectedHour}.json`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${url}`);
        return res.json();
      })
      .then((data) => {
        const formattedPoints = data.map((coords, index) => ({
          id: `balloon-${index}`,
          lat: coords[1],
          lng: coords[0],
          alt: coords[2] / 1000,
          radius: 0.5,
          color: "red",
          originalCoords: coords,
        }));
        setPoints(formattedPoints);
      })
      .catch((err) => {
        console.error(err);
        setPoints([]); // Clear points if JSON fails to load
      });
  }, [selectedHour]);

  const handleSliderChange = (e) => {
    const hour = parseInt(e.target.value);
    setSelectedHour(hour.toString().padStart(2, "0"));
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        pointsData={points}
        pointAltitude="alt"
        pointColor={(point) =>
          point.id === selectedBalloon?.id ? "#ffff00" : "red"
        }
        pointRadius={(point) => (point.id === selectedBalloon?.id ? 0.8 : 0.5)}
        pointsMerge={false}
        pointResolution={12}
        pointAltitudeAutoScale={true}
        backgroundColor="#000011"
        atmosphereColor="#6891d9"
        onPointClick={(point) => setSelectedBalloon(point)}
        onGlobeClick={() => setSelectedBalloon(null)}
      />

      {selectedBalloon && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "rgba(255, 255, 255, 0.9)",
            padding: "12px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            color: "#000",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0" }}>Selected Balloon</h3>
          <p style={{ margin: "0" }}>ID: {selectedBalloon.id}</p>
          <p style={{ margin: "4px 0 0 0" }}>
            Coordinates: {selectedBalloon.originalCoords.join(", ")}
          </p>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255, 255, 255, 0.8)",
          padding: "10px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <input
          type="range"
          min="0"
          max="23"
          value={parseInt(selectedHour)}
          onChange={handleSliderChange}
          style={{ width: "300px" }}
        />
        <div>
          {selectedHour === "00" ? "Current Hour" : `${selectedHour} hours ago`}
        </div>
      </div>
    </div>
  );
};

export default BalloonGlobe;
