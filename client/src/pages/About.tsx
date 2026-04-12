import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import "../style/common.css";
import exec_team from "../images/exec_team.png";

/** 
  Collapsible Component
  --> Maybe move this elsewhere?
*/
interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      {/* Click to toggle the collapsible */}
      <button onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          background: "none",
          border: "none"
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
          fontSize: 22,
          borderBottom: "1px solid",
        }}
        >
          <h2>{title}</h2>
          <span>
            {isOpen ? <ChevronUp className="dynamic-size-icon" /> : <ChevronDown className="dynamic-size-icon" />}
          </span>
        </div>
      </button>

      {/* Render when opening the section */}
      {isOpen && (
        <div
          style={{textAlign: "left"}}
        >
          {children}
        </div>
      )}
    </div>
  );
};


/**
  About Page Content
*/

const About = () => {
  return <div>
    <title>Kiwi Asian Club - About Us</title>
    {/** Overview */}
    <section
      className="section yellow-bg"
      style={{
        width: "100%",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontWeight: 700, fontSize: 46,
        }}
      >
        A B O U T &nbsp; U S
      </h1>
      <img
        src={exec_team}
        alt="Kiwi Asian Club Executive Team"
        className="medium-content"
      />

      {/** What We Do */}
      <div className="medium-content">
        <Collapsible title="WHAT WE DO">
          <p
            style={{ fontSize: 26 }}
          >
            The Kiwi Asian Club is a group for everyone on and off campus!
            We have been one of the most active clubs on campus since 2001, hosting weekly social,
            cultural, sporting, and charity events throughout the university year.
            <br/><br/>
            We aim to build lasting friendships and help you form meaningful connections and memories.
            With over 1000 members, we celebrate the cultural diversity of students in New Zealand,
            and people of all backgrounds are welcome to join.
            <br/><br/>
            If you're a new member, don't worry! We hold team-based events for people to meet each other,
            and our friendly executive team is here to help you along the way.
            <br/><br/>
            Keep yourself informed by visiting our LinkTree to sign up for events
            and connect with us on social media!
          </p>
        </Collapsible>
      </div>
    </section>

    {/** Executive Cards */}
    <p style={{ textAlign: "center" }}>pretend fancy exec cards are here (they will be eventually).</p>
  </div>;
};

export default About;
