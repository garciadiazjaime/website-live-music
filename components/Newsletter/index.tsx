import { ChangeEvent, useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = () => {};

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <section
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "stretch",
        gap: 20,
        justifyContent: "center",
        width: "calc(100% - 0px)",
        maxWidth: 780,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          maxWidth: 500,
          margin: "1rem",
        }}
      >
        <input
          type="text"
          value={email}
          onChange={handleChange}
          placeholder="Join our mailing list"
          style={{
            padding: "6px 12px",
            fontSize: "18px",
            flex: 1,
          }}
        />
        <input
          type="submit"
          value="Join"
          style={{
            background: "red",
            color: "white",
            padding: "6px 20px",
            fontSize: "18px",
            border: "none",
          }}
        />
      </form>
      <style jsx>
        {" "}
        {`
          input::placeholder {
            font-style: italic;
            opacity: 0.6;
          }
        `}
      </style>
    </section>
  );
};

export default Newsletter;
