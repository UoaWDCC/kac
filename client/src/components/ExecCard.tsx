import "../style/common.css";

/** No access to images currently, use placeholder */
const EXEC_IMG = "src/images/exec-placeholder.png";

interface ExecProps {
  imageURL: string;
  displayName: string;
  role: string;
  description: string;
  fullName: string;
  ethnicity: string;
  degree: string;
  mbti: string;
  fact: string;
  sponsor: string;
  greenFlag: string;
  redFlag: string;
  emojis: string;
}

const ExecCard: React.FC<ExecProps> = ({
  imageURL,
  displayName,
  role,
  description,
  fullName,
  ethnicity,
  degree,
  mbti,
  fact,
  sponsor,
  greenFlag,
  redFlag,
  emojis,
}) => {
  return (
    <div className="executive-card">
      <img src={EXEC_IMG || imageURL} alt={displayName} />
      <h2>{displayName}</h2>

      <div className="card-body">
        <p>
          Meet our {role}, {displayName}!
        </p>
        <p className="exec-desc">{description}</p>
        <ul>
          <li>Full Name: {fullName}</li>
          {ethnicity !== "" && <li>Ethnicity: {ethnicity}</li>}
          {degree !== "" && <li>Degree: {degree}</li>}
          <li>MBTI: {mbti}</li>
          <li>Fun Fact: {fact}</li>
          <li>Favourite KAC Sponsor: {sponsor}</li>
          <li>Green Flag ✅: {greenFlag}</li>
          <li>Red Flag 🚩: {redFlag}</li>
          {emojis !== "" && <li>Fav Emojis: {emojis}</li>}
        </ul>
      </div>
    </div>
  );
};

export default ExecCard;
