const PageTitle = ({ title }: { title: string }) => {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
      <section style={{ padding: "6rem 0 2rem 0" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src="src/images/kaco-title.png"
            alt="Mascot"
            style={{
              position: "absolute",
              left: "-95px",
              bottom: "20px",
              width: "200px",
              zIndex: 2,
            }}
          />
          <h1
            className="sponsors-title"
            style={{
              fontWeight: "bold",
              margin: 0,
              fontSize: "6rem",
              paddingLeft: "2rem",
            }}
          >
            {title}
          </h1>
        </div>
      </section>
    </div>
  );
};

export default PageTitle;
