import "../style/common.css";
import "../style/about.css";
import executives from "../placeholders/executives.json";

import ExecCard from "./ExecCard";

const Executives = () => {
    return (
        <div className="executives-container">
            {executives.map((data, key) => {
                return (
                    <ExecCard
                        key={key}
                        imageURL={data.imageURL}
                        displayName={data.displayName}
                        role={data.role}
                        description={data.description}
                        fullName={data.fullName}
                        ethnicity={data.ethnicity}
                        degree={data.degree}
                        mbti={data.mbti}
                        fact={data.fact}
                        sponsor={data.sponsor}
                        greenFlag={data.greenFlag}
                        redFlag={data.redFlag}
                        emojis={data.emojis}
                    />
                );
            })}
        </div>
    );
};

export default Executives;