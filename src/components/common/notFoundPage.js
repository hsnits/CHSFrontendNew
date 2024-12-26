import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div>
      <h2>Page Not Found</h2>
      <div>
        <Link to={"/"}>
          <Button>Go to home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
