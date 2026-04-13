import "../style/common.css";


interface ExecutiveProps {
    cards: string  // placeholder
}

const Executives: React.FC<ExecutiveProps> = ({ cards }) => {
    return (
        <div>
            <p style={{ textAlign: "center" }}>Placeholder Executives Component!</p>
        </div>
    );
};

export default Executives;
