USE cms_DB;

INSERT INTO employee (first_name, last_name, role_id)
VALUES 
("John", "Doe", 1), 
("Mike", "Chan", 2), 
("Ashley", "Rodriguez", 3), 
("Kevin", "Tupik", 4), 
("Malia", "Brown", 5), 
("Sarah", "Lourd", 6), 
("Tom", "Allen", 7), 
("Christian", "Eckenrode", 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), ("Salesperson", 80000, 1), 
("Lead Engineer", 150000, 2), ("Software Engineer", 120000, 2),
("Accountant", 125000, 3),
("Legal Team Lead", 250000, 4), ("Lawyer", 190000, 4);

INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");







