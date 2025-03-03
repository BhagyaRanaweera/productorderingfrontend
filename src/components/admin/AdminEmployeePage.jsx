import React, { useState } from "react";
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

const AdminEmployeePage = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", position: "Manager", email: "john@example.com" },
    { id: 2, name: "Jane Smith", position: "HR", email: "jane@example.com" }
  ]);

  const [newEmployee, setNewEmployee] = useState({ name: "", position: "", email: "" });

  // Handle input changes
  const handleChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  // Add employee
  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.position && newEmployee.email) {
      setEmployees([...employees, { id: employees.length + 1, ...newEmployee }]);
      setNewEmployee({ name: "", position: "", email: "" }); // Reset form
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Employee Management</h2>

      {/* Employee Form */}
      <Paper className="p-4 mb-4">
        <h3 className="text-lg font-semibold">Add Employee</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <TextField label="Name" name="name" value={newEmployee.name} onChange={handleChange} fullWidth />
          <TextField label="Position" name="position" value={newEmployee.position} onChange={handleChange} fullWidth />
          <TextField label="Email" name="email" value={newEmployee.email} onChange={handleChange} fullWidth />
        </div>
        <Button variant="contained" color="primary" onClick={handleAddEmployee} className="mt-3">
          Add Employee
        </Button>
      </Paper>

      {/* Employee Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.id}</TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminEmployeePage;
