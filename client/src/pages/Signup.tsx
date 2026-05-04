import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/useAuth";

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

const Signup = () => {
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

    // Redirect away if not signed in or already has an account
    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate("/");
            } else if (hasAccount) {
                navigate("/");
            }
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
            setError(
                err.response?.data?.message ?? "Something went wrong. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

    const email = user?.emails?.[0]?.value ?? "";

    return (
        <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 1rem" }}>
            <h1>Complete Your Registration</h1>
            <p style={{ color: "#555", marginBottom: "1.5rem" }}>
                Welcome! Please fill in a few details to finish creating your account.
            </p>

            {error && (
                <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Email — read-only, sourced from Google */}
                <Field label="Email Address">
                    <input
                        type="email"
                        value={email}
                        readOnly
                        style={{ ...inputStyle, background: "#f5f5f5", cursor: "not-allowed" }}
                    />
                </Field>

                <div style={{ display: "flex", gap: "1rem" }}>
                    <Field label="First Name" style={{ flex: 1 }}>
                        <input
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </Field>
                    <Field label="Last Name" style={{ flex: 1 }}>
                        <input
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </Field>
                </div>

                <Field label="Mobile Number">
                    <input
                        name="mobileNumber"
                        type="tel"
                        placeholder="+64 21 123 4567"
                        value={form.mobileNumber}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                </Field>

                <Field label="Pronouns (optional)">
                    <input
                        name="pronouns"
                        placeholder="e.g. she/her, he/him, they/them"
                        value={form.pronouns}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </Field>

                <Field label="University">
                    <input
                        name="university"
                        placeholder="e.g. University of Auckland"
                        value={form.university}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                </Field>

                <div style={{ display: "flex", gap: "1rem" }}>
                    <Field label="Student ID Number" style={{ flex: 1 }}>
                        <input
                            name="studentId"
                            value={form.studentId}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </Field>
                    <Field label="Student Username / UPI" style={{ flex: 1 }}>
                        <input
                            name="upi"
                            placeholder="e.g. jdoe123"
                            value={form.upi}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </Field>
                </div>

                <Field label="Year of Study">
                    <select
                        name="yearOfStudy"
                        value={form.yearOfStudy}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    >
                        <option value="">Select year</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((y) => (
                            <option key={y} value={y}>
                                Year {y}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Faculty (select all that apply)">
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {FACULTIES.map((faculty) => (
                            <label
                                key={faculty}
                                style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
                            >
                                <input
                                    type="checkbox"
                                    checked={form.faculties.includes(faculty)}
                                    onChange={() => handleFacultyChange(faculty)}
                                />
                                {faculty}
                            </label>
                        ))}
                    </div>
                </Field>

                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{
                        marginTop: "1rem",
                        padding: "0.75rem 1.5rem",
                        background: submitting ? "#ccc" : "#f5c518",
                        border: "none",
                        borderRadius: "4px",
                        cursor: submitting ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        fontSize: "1rem",
                    }}
                >
                    {submitting ? "Creating Account..." : "Create Account"}
                </button>
            </div>
        </div>
    );
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.5rem 0.75rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
    boxSizing: "border-box",
};

const Field = ({
    label,
    children,
    style,
}: {
    label: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", ...style }}>
        <label style={{ fontWeight: "500", fontSize: "0.9rem" }}>{label}</label>
        {children}
    </div>
);

export default Signup;