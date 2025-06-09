import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SurveyForm = () => {
  const [rating, setRating] = useState<number>(5);
  const [suggestion, setSuggestion] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/api/survey", {
        rating,
        comment: suggestion || null,
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError("Failed to submit feedback. Please try again later.");
    }
  };

  if (submitted) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="alert alert-success w-100 text-center">
          <h4>Thank you for your feedback!</h4>
          <Link to="/" className="btn btn-primary mt-3">
            Go Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <form
        onSubmit={handleSubmit}
        className="card shadow-lg p-5 w-100"
        style={{ maxWidth: "600px" }}
      >
        <h3 className="mb-4 text-center">Rate Your Experience</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label htmlFor="rating" className="form-label">
            Satisfaction Rating (1 = Poor, 5 = Excellent)
          </label>
          <select
            id="rating"
            className="form-select"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} -{" "}
                {["Poor", "Fair", "Good", "Very Good", "Excellent"][num - 1]}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="suggestion" className="form-label">
            Suggestion for Improvement (Optional)
          </label>
          <textarea
            id="suggestion"
            className="form-control"
            rows={5}
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="How can we improve your experience?"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default SurveyForm;
