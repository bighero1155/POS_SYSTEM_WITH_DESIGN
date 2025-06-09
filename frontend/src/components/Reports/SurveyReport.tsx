import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Card,
  ProgressBar,
  ListGroup,
  Container,
  Row,
  Col,
} from "react-bootstrap";

interface Survey {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

const SurveyReport: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/survey", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        setSurveys(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch survey data");
        setLoading(false);
        console.error(err);
      }
    };

    fetchSurveyData();
  }, []);

  const getProgressBarVariant = (rating: number): string => {
    switch (rating) {
      case 1:
        return "danger";
      case 2:
        return "warning";
      case 3:
        return "info";
      case 4:
        return "primary";
      case 5:
        return "success";
      default:
        return "secondary";
    }
  };

  if (loading)
    return <div className="text-center mt-5">Loading survey data...</div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  const totalResponses = surveys.length;
  const ratingCounts = [1, 2, 3, 4, 5].map((star) => {
    const count = surveys.filter((s) => s.rating === star).length;
    const percentage = totalResponses > 0 ? (count / totalResponses) * 100 : 0;
    return { star, count, percentage };
  });

  const averageRating =
    totalResponses > 0
      ? surveys.reduce((sum, survey) => sum + survey.rating, 0) / totalResponses
      : 0;

  const positiveRatings = surveys.filter((s) => s.rating >= 4).length;
  const negativeRatings = surveys.filter((s) => s.rating <= 2).length;
  const recentComments = [...surveys]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .filter((s) => s.comment)
    .slice(0, 5);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Customer Feedback Report</h2>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Rating Distribution</h5>
            </Card.Header>
            <Card.Body>
              {ratingCounts.map(({ star, count, percentage }) => (
                <div key={star} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>
                      {star} Star{star !== 1 ? "s" : ""}
                    </span>
                    <span>
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <ProgressBar
                    now={percentage}
                    variant={getProgressBarVariant(star)}
                    className="mb-2"
                    label={`${percentage.toFixed(1)}%`}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Summary Statistics</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Total Responses:</strong> {totalResponses}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Average Rating:</strong> {averageRating.toFixed(1)} /
                  5
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Positive Ratings (4-5 Stars):</strong>{" "}
                  {positiveRatings} (
                  {totalResponses > 0
                    ? ((positiveRatings / totalResponses) * 100).toFixed(1)
                    : 0}
                  %)
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Negative Ratings (1-2 Stars):</strong>{" "}
                  {negativeRatings} (
                  {totalResponses > 0
                    ? ((negativeRatings / totalResponses) * 100).toFixed(1)
                    : 0}
                  %)
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5>Recent Comments</h5>
        </Card.Header>
        <Card.Body>
          {recentComments.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentComments.map((survey, index) => (
                  <tr key={index}>
                    <td>
                      {survey.rating} Star{survey.rating !== 1 ? "s" : ""}
                    </td>
                    <td>{survey.comment}</td>
                    <td>{new Date(survey.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">No comments available</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SurveyReport;
