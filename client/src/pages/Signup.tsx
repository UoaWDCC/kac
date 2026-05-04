import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/useAuth";
import "../style/common.css";
import "../style/signup.css";

const FACULTIES = [
    "Arts",
    "Business School",
    "Creative Arts and Industries",
    "Education and Social Work",
    "Engineering",
    "Law",
    "Medical and Health Sciences",
    "Science",
];

const SignUp = () => {
    const { user, hasAccount, loading } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        mobileNumber: "",
        pronouns: "",
        university: "",
        studentId: "",
        upi: "",
        yearOfStudy: "",
        faculties: [] as string[],
    });

    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) navigate("/");
            else if (hasAccount) navigate("/");
        }
    }, [user, hasAccount, loading, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFacultyChange = (faculty: string) => {
        setForm((prev) => ({
            ...prev,
            faculties: prev.faculties.includes(faculty)
                ? prev.faculties.filter((f) => f !== faculty)
                : [...prev.faculties, faculty],
        }));
    };

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (form.faculties.length === 0) {
            setError("Please select at least one faculty.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await axios.post("/api/users/signup", {
                ...form,
                yearOfStudy: Number(form.yearOfStudy),
            });
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message ?? "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

    const email = user?.emails?.[0]?.value ?? "";

    return (
        <div className="signup-page">
            <h1 className="signup-title">SIGN UP</h1>
            <p className="signup-intro">
                Complete your registration to become a Kiwi Asian Club member.
            </p>

            <div className="signup-form">
                {error && <p className="signup-error">{error}</p>}

                {/* Email — read-only from Google */}
                <div className="signup-field">
                    <label>Email Address</label>
                    <input type="email" value={email} readOnly />
                </div>

                <div className="signup-row">
                    <div className="signup-field half">
                        <label>First Name</label>
                        <input name="firstName" placeholder="e.g. Jonah" value={form.firstName} onChange={handleChange} />
                    </div>
                    <div className="signup-field half">
                        <label>Last Name</label>
                        <input name="lastName" placeholder="e.g. Dao" value={form.lastName} onChange={handleChange} />
                    </div>
                </div>

                <div className="signup-field">
                    <label>Mobile Number</label>
                    <input
                        name="mobileNumber"
                        type="tel"
                        placeholder="+64 21 123 4567"
                        value={form.mobileNumber}
                        onChange={handleChange}
                    />
                </div>

                <div className="signup-field">
                    <label>Pronouns (optional)</label>
                    <input
                        name="pronouns"
                        placeholder="e.g. she/her, he/him, they/them"
                        value={form.pronouns}
                        onChange={handleChange}
                    />
                </div>

                <div className="signup-field">
                    <label>University</label>
                    <input
                        name="university"
                        placeholder="e.g. University of Auckland"
                        value={form.university}
                        onChange={handleChange}
                    />
                </div>

                <div className="signup-row">
                    <div className="signup-field half">
                        <label>Student ID Number</label>
                        <input name="studentId" placeholder="e.g. 4206769173" value={form.studentId} onChange={handleChange} />
                    </div>
                    <div className="signup-field half">
                        <label>Student Username / UPI</label>
                        <input
                            name="upi"
                            placeholder="e.g. jdoe123"
                            value={form.upi}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="signup-field">
                    <label>Year of Study</label>
                    <select name="yearOfStudy" value={form.yearOfStudy} onChange={handleChange}>
                        <option value="">Select year</option>
                        {/* Will need to change this to cater for Postgrads and Alumni currently set up as a number*/}
                        {[1, 2, 3, 4, 5, 6].map((y) => (
                            <option key={y} value={y}>Year {y}</option>
                        ))}
                    </select>
                </div>

                <div className="signup-field">
                    <label>Faculty (select all that apply)</label>
                    <div className="signup-faculties">
                        {FACULTIES.map((faculty) => (
                            <label key={faculty}>
                                <input
                                    type="checkbox"
                                    checked={form.faculties.includes(faculty)}
                                    onChange={() => handleFacultyChange(faculty)}
                                />
                                {faculty}
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    className="signup-submit"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT >>"}
                </button>
            </div>
        </div>
    );
};

export default SignUp;