import React, { useState } from 'react';
import "../style/common.css";


/** No access to images currently, use placeholder */
const EXEC_IMG = "src/images/exec_placeholder.png";

interface ExecProps {
    imageURL: string,
    displayName: string,
    role: string,
    description: string,
    fullName: string,
    ethnicity: string,
    degree: string,
    mbti: string,
    fact: string,
    sponsor: string,
    greenFlag: string,
    redFlag: string,
    emojis: string,
}

const ExecCard: React.FC<ExecProps> = ({
    imageURL, displayName, role, description,
    fullName, ethnicity, degree, mbti, fact,
    sponsor, greenFlag, redFlag, emojis
}) => {
    return (
        <div>
            <img src={EXEC_IMG} alt={displayName}/>
            <h1>{displayName}</h1>
        </div>
    );
};

export default ExecCard;