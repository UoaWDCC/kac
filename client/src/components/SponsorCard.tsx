type Props = {
  name: string;
  description: string;
  location: string;
};

const SponsorCard = (props: Props) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "1rem",
        borderRadius: "20px",
        width: "200px",
        height: "220px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3>{props.name}</h3>
      <p>{props.description}</p>
      <p>{props.location}</p>
    </div>
  );
};

export default SponsorCard;
