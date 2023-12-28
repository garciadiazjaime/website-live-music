import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div style={{ position: "relative" }}>
        <Link href="/chicago" style={{ display: "inline-block" }}>
          <Image
            alt="chicago"
            src="https://cdn.britannica.com/59/94459-050-DBA42467/Skyline-Chicago.jpg"
            width={400}
            height={400}
          />
          <div
            style={{
              position: "absolute",
              top: 120,
              fontSize: 66,
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 400,
              textTransform: "uppercase",
            }}
          >
            Chicago
          </div>
        </Link>
      </div>
    </div>
  );
}
