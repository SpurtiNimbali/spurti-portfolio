import { useEffect, useState } from "react";

function clock(date: Date) {
  return date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "America/Los_Angeles",
    })
    .replace(/ /g, " ");
}

export function CornerMeta() {
  const [now, setNow] = useState(() => clock(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setNow(clock(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="hero-header">
      {/* The clock alone. It reads as Pacific time without being labelled,
          which is what the place name was doing here. */}
      <p className="meta meta-left">
        <span>{now}</span>
      </p>
      <p className="meta meta-right">
        <a href="mailto:snimbali@stanford.edu">snimbali@stanford.edu</a>
      </p>
    </header>
  );
}
