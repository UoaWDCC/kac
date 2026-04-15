import "../style/common.css";

const SignUp = () => {
    
    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const formDataObj = Object.fromEntries(formData.entries());
        const formJson = JSON.stringify(formDataObj);
        console.log(formJson);
    }

    return (
    <div>
        {/** TITLE and Subtitle */}
        <section 
            className="section yellow-bg"
            style={{
            width: "100%",
            textAlign: "center",
            }}
        >
            <h1 style={{ marginBottom: "16px" }}>S I G N &nbsp; U P</h1>
            <p>Join the KAC family today!</p>
        </section>

        {/** Input fields */}
        <section className="section yellow-bg">
            <div className="narrow-content">
                <form 
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    method="post" 
                    onSubmit={handleSubmit}
                >

                    <label htmlFor="firstName" className = "font-bold">First Name</label>
                    <input type="text" id="firstName" name="firstName" placeholder="Your first name.." />

                    <label htmlFor="lastName" className = "font-bold">Last Name</label>
                    <input type="text" id="lastName" name="lastName" placeholder="Your last name.." />

                    <label htmlFor="email" className = "font-bold">Email</label>
                    <input type="email" id="email" name="email" placeholder="Your email.." />

                    <label htmlFor="phone" className = "font-bold">Phone Number</label>
                    <input type="text" id="phone" name="phone" placeholder="Your phone number.." />

                    <label htmlFor="gender" className = "font-bold">Gender</label>
                    <label htmlFor="male">
                        <input type="radio" id="male" name="gender" value="Male" />
                        Male
                    </label>
                    
                    <label htmlFor="female">
                        <input type="radio" id="female" name="gender" value="Female" />
                        Female
                    </label>
                    
                    <label htmlFor="other">
                        <input type="radio" id="other" name="gender" value="Other" />
                        Other
                    </label>

                    <label htmlFor="university" className = "font-bold">University</label>
                    <input type="text" id="university" name="university" placeholder="Your university.." />

                    <label htmlFor="studentID" className = "font-bold">Student ID - N/A if not applicable</label>
                    <input type="text" id="studentID" name="studentID" placeholder="Your student ID.." />

                    <label htmlFor="studentUPI" className = "font-bold">Student UPI - N/A if not applicable</label>
                    <input type="text" id="studentUPI" name="studentUPI" placeholder="Your student UPI.." />

                    <label htmlFor="Year of Study" className = "font-bold">Year of Study</label>
                    <input type="text" id="yearOfStudy" name="yearOfStudy" placeholder="Your year of study.." />

                    <label htmlFor="faculty" className = "font-bold">Faculty</label>
                    <input type="text" id="faculty" name="faculty" placeholder="Your faculty.." />

                    <label htmlFor="status" className = "font-bold">Status</label>
                    <label htmlFor="new">
                        <input type="radio" id="new" name="status" value="New" />
                        New
                    </label>
                    
                    <label htmlFor="returning">
                        <input type="radio" id="returning" name="status" value="Returning" />
                        Returning
                    </label>
                    
                    <label htmlFor="formerExec">
                        <input type="radio" id="formerExec" name="status" value="Former Executive" />
                        Former Executive
                    </label>

                    <input type="submit" value="Submit" style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#f0c040', border: '1px solid #000000', cursor: 'pointer' }} />
                </form>
            </div>
        </section>
    </div>
    );
};

export default SignUp;