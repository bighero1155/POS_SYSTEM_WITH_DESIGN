import React from "react";
import CategoryReport from "./CategoryReport";
import ProductStockChart from "./ProductStockChart";
import SurveyReport from "./SurveyReport";
import { Container, Row, Col, Card } from "react-bootstrap";

const Reports: React.FC = () => {
  return (
    <Container fluid className="bg-light py-4 min-vh-100">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Reports Dashboard</h1>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Product Stock Overview</h5>
            </Card.Header>
            <Card.Body>
              <ProductStockChart />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Product Category Report</h5>
            </Card.Header>
            <Card.Body>
              <CategoryReport />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Customer Survey Feedback</h5>
            </Card.Header>
            <Card.Body>
              <SurveyReport />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
