import React, { useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Paper } from "@mui/material";

const AdminReviewPage = () => {
  const [reviews, setReviews] = useState([
    { id: 1, user: "Alice", rating: 5, comment: "Great product!" },
    { id: 2, user: "Bob", rating: 3, comment: "Decent quality." },
    { id: 3, user: "Charlie", rating: 4, comment: "Fast shipping, good item!" },
  ]);

  const handleDelete = (id) => {
    setReviews(reviews.filter(review => review.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Reviews</h2>
      <Paper className="p-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.user}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell>
                  <Button variant="contained" color="error" onClick={() => handleDelete(review.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default AdminReviewPage;
