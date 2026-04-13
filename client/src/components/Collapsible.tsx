import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import "../style/about.css";

/**
    Collapsible Component
*/

interface CollapsibleProps {
    title: string;
    children: React.ReactNode;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            {/* Click to toggle the collapsible */}
            <button onClick={() => setIsOpen(!isOpen)}>
                <div className="collapsible-content">
                    <h2 className="collapsible-title">{title}</h2>
                    <span>
                        {isOpen ? <ChevronUp className="dynamic-size-icon" /> : <ChevronDown className="dynamic-size-icon" />}
                    </span>
                </div>
            </button>

            {/* Render when opening the section */}
            {isOpen && (
                <div className="collapsible-children">{ children }</div>
            )}
        </div>
    );
};

export default Collapsible;
