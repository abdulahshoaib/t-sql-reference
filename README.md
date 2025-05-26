## Comprehensive T-SQL Reference Guide

### Table of Contents
1. [Data Query Language (DQL)](#data-query-language-dql)
   - [SELECT Statement](#select-statement)
   - [Joins](#joins)
   - [Nested Queries](#nested-queries)
   - [Aggregation & Subqueries](#aggregation--subqueries)
   - [GROUP BY & HAVING Clauses](#group-by--having-clauses)
2. [Data Manipulation Language (DML)](#data-manipulation-language-dml)
   - [INSERT Statement](#insert-statement)
   - [UPDATE Statement](#update-statement)
   - [DELETE Statement](#delete-statement)
3. [Data Definition Language (DDL)](#data-definition-language-ddl)
   - [Schema Creation](#schema-creation)
   - [Views](#views)
   - [Stored Procedures](#stored-procedures)
   - [Triggers](#triggers)
   - [User-Defined Types](#user-defined-types)
4. [Transaction Control Language (TCL)](#transaction-control-language-tcl)
   - [Transactions](#transactions)
5. [PL/SQL & Functions](#plsql--functions)
   - [RAND Function](#rand-function)
   - [Other Built-in Functions](#other-built-in-functions)

## Data Query Language (DQL)

### SELECT Statement

The SELECT statement is used to retrieve data from one or more tables.

**Basic Syntax:**
```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition
ORDER BY column1 [ASC|DESC];
```

**Example:**
```sql
-- Retrieve all columns from Employees table
SELECT * FROM Employees;

-- Retrieve specific columns with conditions
SELECT FirstName, LastName, Salary
FROM Employees
WHERE Department = 'IT'
ORDER BY Salary DESC;
```

**Key Clauses and Keywords:**

- **DISTINCT** - Returns only unique values
  ```sql
  SELECT DISTINCT Department FROM Employees;
  ```

- **TOP** - Limits the number of rows returned
  ```sql
  SELECT TOP 10 * FROM Products
  ORDER BY Price DESC;
  ```

- **OFFSET-FETCH** - Skip rows and fetch a specified number of rows
  ```sql
  SELECT * FROM Products
  ORDER BY ProductID
  OFFSET 10 ROWS
  FETCH NEXT 10 ROWS ONLY;
  ```

- **WITH TIES** - Includes any additional rows that tie for the last position
  ```sql
  SELECT TOP 5 WITH TIES * FROM Products
  ORDER BY Price DESC;
  ```

- **AS** - Aliasing columns or tables
  ```sql
  SELECT FirstName AS Name, LastName AS Surname
  FROM Employees AS E;
  ```

### Joins

Joins are used to combine rows from two or more tables based on a related column.

**Types of Joins:**

1. **INNER JOIN** - Returns records that have matching values in both tables
   ```sql
   SELECT e.FirstName, e.LastName, d.DepartmentName
   FROM Employees e
   INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID;
   ```

2. **LEFT JOIN** (or LEFT OUTER JOIN) - Returns all records from the left table and matched records from the right table
   ```sql
   SELECT e.FirstName, e.LastName, d.DepartmentName
   FROM Employees e
   LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID;
   ```

3. **RIGHT JOIN** (or RIGHT OUTER JOIN) - Returns all records from the right table and matched records from the left table
   ```sql
   SELECT e.FirstName, e.LastName, d.DepartmentName
   FROM Employees e
   RIGHT JOIN Departments d ON e.DepartmentID = d.DepartmentID;
   ```

4. **FULL JOIN** (or FULL OUTER JOIN) - Returns all records when there is a match in either left or right table
   ```sql
   SELECT e.FirstName, e.LastName, d.DepartmentName
   FROM Employees e
   FULL JOIN Departments d ON e.DepartmentID = d.DepartmentID;
   ```

5. **CROSS JOIN** - Returns the Cartesian product of both tables
   ```sql
   SELECT e.FirstName, d.DepartmentName
   FROM Employees e
   CROSS JOIN Departments d;
   ```

6. **SELF JOIN** - Joins a table to itself
   ```sql
   SELECT e1.FirstName AS Employee, e2.FirstName AS Manager
   FROM Employees e1
   INNER JOIN Employees e2 ON e1.ManagerID = e2.EmployeeID;
   ```

### Nested Queries

Nested queries (or subqueries) are queries embedded within another query.

**Types of Nested Queries:**

1. **Scalar Subquery** - Returns a single value
   ```sql
   SELECT FirstName, LastName, Salary,
          (SELECT AVG(Salary) FROM Employees) AS AverageSalary
   FROM Employees;
   ```

2. **Column Subquery** - Returns a single column of multiple values
   ```sql
   SELECT * FROM Employees
   WHERE DepartmentID IN (SELECT DepartmentID FROM Departments WHERE Location = 'New York');
   ```

3. **Table Subquery** - Returns a table of rows and columns
   ```sql
   SELECT e.FirstName, e.LastName, d.DepartmentName
   FROM Employees e
   INNER JOIN (SELECT * FROM Departments WHERE Location = 'New York') d
   ON e.DepartmentID = d.DepartmentID;
   ```

4. **Correlated Subquery** - References columns from the outer query
   ```sql
   SELECT e1.FirstName, e1.LastName, e1.Salary
   FROM Employees e1
   WHERE e1.Salary > (SELECT AVG(e2.Salary) FROM Employees e2 WHERE e2.DepartmentID = e1.DepartmentID);
   ```

### Aggregation & Subqueries

Aggregation functions perform calculations on a set of values and return a single value.

**Common Aggregation Functions:**

1. **COUNT** - Counts rows or non-NULL values
   ```sql
   SELECT COUNT(*) FROM Employees;
   SELECT COUNT(ManagerID) FROM Employees;
   ```

2. **SUM** - Calculates the sum of values
   ```sql
   SELECT SUM(Salary) FROM Employees;
   ```

3. **AVG** - Calculates the average of values
   ```sql
   SELECT AVG(Salary) FROM Employees;
   ```

4. **MIN** - Finds the minimum value
   ```sql
   SELECT MIN(Salary) FROM Employees;
   ```

5. **MAX** - Finds the maximum value
   ```sql
   SELECT MAX(Salary) FROM Employees;
   ```

**Subqueries with Aggregation:**
```sql
-- Finding employees who earn more than average
SELECT FirstName, LastName, Salary
FROM Employees
WHERE Salary > (SELECT AVG(Salary) FROM Employees);

-- Using EXISTS operator
SELECT d.DepartmentName
FROM Departments d
WHERE EXISTS (SELECT 1 FROM Employees e WHERE e.DepartmentID = d.DepartmentID AND e.Salary > 50000);

-- Using ANY operator
SELECT FirstName, LastName, Salary
FROM Employees
WHERE Salary > ANY (SELECT Salary FROM Employees WHERE DepartmentID = 3);

-- Using ALL operator
SELECT FirstName, LastName, Salary
FROM Employees
WHERE Salary > ALL (SELECT Salary FROM Employees WHERE DepartmentID = 3);
```

### GROUP BY & HAVING Clauses

GROUP BY groups rows with the same values, often used with aggregate functions. HAVING applies filters to grouped results.

**Syntax:**
```sql
SELECT column1, column2, aggregate_function(column3)
FROM table_name
WHERE condition
GROUP BY column1, column2
HAVING condition_on_aggregate
ORDER BY column1;
```

**Examples:**
```sql
-- Count employees by department
SELECT DepartmentID, COUNT(*) AS EmployeeCount
FROM Employees
GROUP BY DepartmentID;

-- Find departments with average salary greater than 50000
SELECT DepartmentID, AVG(Salary) AS AvgSalary
FROM Employees
GROUP BY DepartmentID
HAVING AVG(Salary) > 50000;

-- Find departments with more than 5 employees
SELECT d.DepartmentName, COUNT(e.EmployeeID) AS EmployeeCount
FROM Departments d
JOIN Employees e ON d.DepartmentID = e.DepartmentID
GROUP BY d.DepartmentName
HAVING COUNT(e.EmployeeID) > 5
ORDER BY EmployeeCount DESC;
```

**Key Points:**
- WHERE filters rows before grouping
- HAVING filters groups after grouping
- Columns in the SELECT list must either be in the GROUP BY clause or be used with aggregate functions

---

## Data Manipulation Language (DML)

### INSERT Statement

The INSERT statement adds one or more rows to a table.

**Basic Syntax:**
```sql
-- For a single row
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);

-- For multiple rows
INSERT INTO table_name (column1, column2, ...)
VALUES
    (value1, value2, ...),
    (value1, value2, ...),
    ...;

-- Insert data from another table
INSERT INTO table_name (column1, column2, ...)
SELECT column1, column2, ...
FROM source_table
WHERE condition;
```

**Examples:**
```sql
-- Insert a single row
INSERT INTO Employees (FirstName, LastName, Email, DepartmentID)
VALUES ('John', 'Smith', 'john.smith@example.com', 1);

-- Insert multiple rows
INSERT INTO Departments (DepartmentName, Location)
VALUES
    ('Marketing', 'New York'),
    ('Research', 'Boston'),
    ('Development', 'San Francisco');

-- Insert with SELECT
INSERT INTO EmployeeArchive (EmployeeID, FirstName, LastName, TerminationDate)
SELECT EmployeeID, FirstName, LastName, GETDATE()
FROM Employees
WHERE Status = 'Terminated';
```

### UPDATE Statement

The UPDATE statement modifies existing data in a table.

**Basic Syntax:**
```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```

**Examples:**
```sql
-- Update a single column
UPDATE Employees
SET Salary = 55000
WHERE EmployeeID = 101;

-- Update multiple columns
UPDATE Employees
SET Salary = Salary * 1.1, Title = 'Senior ' + Title
WHERE DepartmentID = 3 AND YearsOfService > 5;

-- Update with JOIN
UPDATE e
SET e.Salary = e.Salary * 1.15
FROM Employees e
INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID
WHERE d.DepartmentName = 'IT';

-- Update with subquery
UPDATE Products
SET Price = Price * 0.9
WHERE CategoryID IN (SELECT CategoryID FROM Categories WHERE CategoryName = 'Electronics');
```

### DELETE Statement

The DELETE statement removes rows from a table.

**Basic Syntax:**
```sql
DELETE FROM table_name
WHERE condition;
```

**Examples:**
```sql
-- Delete specific rows
DELETE FROM Employees
WHERE TerminationDate IS NOT NULL;

-- Delete with JOIN
DELETE e
FROM Employees e
INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID
WHERE d.DepartmentName = 'Temp';

-- Delete with subquery
DELETE FROM OrderDetails
WHERE OrderID IN (SELECT OrderID FROM Orders WHERE OrderDate < '2020-01-01');

-- Truncate table (removes all rows, faster than DELETE)
TRUNCATE TABLE TempData;
```

---

## Data Definition Language (DDL)

### Schema Creation

Schema creation involves defining database objects like tables, constraints, and indexes.

**Create Database:**
```sql
CREATE DATABASE EmployeeDB;

-- With specific options
CREATE DATABASE EmployeeDB
ON PRIMARY
(
    NAME = 'EmployeeDB_Data',
    FILENAME = 'C:\Data\EmployeeDB_Data.mdf',
    SIZE = 100MB,
    MAXSIZE = 1GB,
    FILEGROWTH = 10%
)
LOG ON
(
    NAME = 'EmployeeDB_Log',
    FILENAME = 'C:\Data\EmployeeDB_Log.ldf',
    SIZE = 50MB,
    MAXSIZE = 500MB,
    FILEGROWTH = 5MB
);
```

**Create Schema:**
```sql
CREATE SCHEMA HR;
```

**Create Table:**
```sql
CREATE TABLE HR.Employees
(
    EmployeeID INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) UNIQUE,
    PhoneNumber NVARCHAR(20),
    HireDate DATE DEFAULT GETDATE(),
    Salary DECIMAL(10, 2) CHECK (Salary > 0),
    DepartmentID INT FOREIGN KEY REFERENCES Departments(DepartmentID)
);
```

**Alter Table:**
```sql
-- Add column
ALTER TABLE HR.Employees
ADD MiddleName NVARCHAR(50);

-- Modify column
ALTER TABLE HR.Employees
ALTER COLUMN PhoneNumber NVARCHAR(30);

-- Add constraint
ALTER TABLE HR.Employees
ADD CONSTRAINT FK_Department
FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID);

-- Drop constraint
ALTER TABLE HR.Employees
DROP CONSTRAINT FK_Department;

-- Drop column
ALTER TABLE HR.Employees
DROP COLUMN MiddleName;
```

**Create Index:**
```sql
-- Non-clustered index
CREATE INDEX IX_Employees_LastName
ON HR.Employees (LastName);

-- Unique index
CREATE UNIQUE INDEX IX_Employees_Email
ON HR.Employees (Email)
WHERE Email IS NOT NULL;

-- Composite index
CREATE INDEX IX_Employees_Department_HireDate
ON HR.Employees (DepartmentID, HireDate);
```

**Drop Objects:**
```sql
-- Drop table
DROP TABLE HR.Employees;

-- Drop schema
DROP SCHEMA HR;

-- Drop database
DROP DATABASE EmployeeDB;
```

### Views

Views are virtual tables based on the result of a SELECT query.

**Create View:**
```sql
CREATE VIEW HR.EmployeeDirectory
AS
SELECT e.EmployeeID, e.FirstName, e.LastName, e.Email, d.DepartmentName
FROM HR.Employees e
JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

**Alter View:**
```sql
ALTER VIEW HR.EmployeeDirectory
AS
SELECT e.EmployeeID, e.FirstName, e.LastName, e.Email, d.DepartmentName, e.HireDate
FROM HR.Employees e
JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

**Using Views:**
```sql
-- Query a view
SELECT * FROM HR.EmployeeDirectory
WHERE DepartmentName = 'IT';

-- Create indexed view
CREATE VIEW dbo.DepartmentSalaryStats
WITH SCHEMABINDING
AS
SELECT DepartmentID, COUNT_BIG(*) AS EmployeeCount, SUM(Salary) AS TotalSalary
FROM dbo.Employees
GROUP BY DepartmentID;

CREATE UNIQUE CLUSTERED INDEX IX_DepartmentSalaryStats
ON dbo.DepartmentSalaryStats (DepartmentID);
```

**Drop View:**
```sql
DROP VIEW HR.EmployeeDirectory;
```

### Stored Procedures

Stored procedures are precompiled SQL statements that can be executed repeatedly.

**Create Procedure:**
```sql
CREATE PROCEDURE HR.GetEmployeesByDepartment
    @DepartmentName NVARCHAR(50),
    @MinSalary DECIMAL(10, 2) = 0
AS
BEGIN
    SET NOCOUNT ON;

    SELECT e.EmployeeID, e.FirstName, e.LastName, e.Salary
    FROM HR.Employees e
    JOIN Departments d ON e.DepartmentID = d.DepartmentID
    WHERE d.DepartmentName = @DepartmentName
      AND e.Salary >= @MinSalary
    ORDER BY e.Salary DESC;
END;
```

**Alter Procedure:**
```sql
ALTER PROCEDURE HR.GetEmployeesByDepartment
    @DepartmentName NVARCHAR(50),
    @MinSalary DECIMAL(10, 2) = 0,
    @IncludeTerminated BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

    SELECT e.EmployeeID, e.FirstName, e.LastName, e.Salary, e.Status
    FROM HR.Employees e
    JOIN Departments d ON e.DepartmentID = d.DepartmentID
    WHERE d.DepartmentName = @DepartmentName
      AND e.Salary >= @MinSalary
      AND (@IncludeTerminated = 1 OR e.Status <> 'Terminated')
    ORDER BY e.Salary DESC;
END;
```

**Execute Procedure:**
```sql
-- Execute with named parameters
EXEC HR.GetEmployeesByDepartment
    @DepartmentName = 'IT',
    @MinSalary = 50000;

-- Execute with positional parameters
EXEC HR.GetEmployeesByDepartment 'IT', 50000;

-- Return output parameter
CREATE PROCEDURE HR.HireEmployee
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @DepartmentID INT,
    @Salary DECIMAL(10, 2),
    @EmployeeID INT OUTPUT
AS
BEGIN
    INSERT INTO HR.Employees (FirstName, LastName, DepartmentID, Salary)
    VALUES (@FirstName, @LastName, @DepartmentID, @Salary);

    SET @EmployeeID = SCOPE_IDENTITY();
END;

-- Execute with output parameter
DECLARE @NewEmployeeID INT;
EXEC HR.HireEmployee
    @FirstName = 'Jane',
    @LastName = 'Doe',
    @DepartmentID = 3,
    @Salary = 60000,
    @EmployeeID = @NewEmployeeID OUTPUT;

SELECT @NewEmployeeID AS NewEmployeeID;
```

**Drop Procedure:**
```sql
DROP PROCEDURE HR.GetEmployeesByDepartment;
```

### Triggers

Triggers are special types of stored procedures that automatically execute when an event occurs.

**Types of Triggers:**
1. **DML Triggers** (AFTER/FOR or INSTEAD OF INSERT, UPDATE, DELETE)
2. **DDL Triggers** (CREATE, ALTER, DROP)
3. **Logon Triggers** (LOGON events)

**Create DML Trigger:**
```sql
-- AFTER trigger example
CREATE TRIGGER HR.trg_AuditEmployeeSalaryChanges
ON HR.Employees
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF UPDATE(Salary)
    BEGIN
        INSERT INTO HR.SalaryAudit (EmployeeID, OldSalary, NewSalary, ChangeDate)
        SELECT i.EmployeeID, d.Salary, i.Salary, GETDATE()
        FROM inserted i
        JOIN deleted d ON i.EmployeeID = d.EmployeeID
        WHERE i.Salary <> d.Salary;
    END;
END;

-- INSTEAD OF trigger example
CREATE TRIGGER HR.trg_PreventDirectoryViewUpdates
ON HR.EmployeeDirectory
INSTEAD OF UPDATE
AS
BEGIN
    RAISERROR('Updates to the EmployeeDirectory view are not allowed.', 16, 1);
    RETURN;
END;

-- DDL trigger example
CREATE TRIGGER PreventTableDrops
ON DATABASE
FOR DROP_TABLE
AS
BEGIN
    PRINT 'Tables cannot be dropped in this database.';
    ROLLBACK;
END;
```

**Disable/Enable Trigger:**
```sql
-- Disable trigger
DISABLE TRIGGER HR.trg_AuditEmployeeSalaryChanges ON HR.Employees;

-- Enable trigger
ENABLE TRIGGER HR.trg_AuditEmployeeSalaryChanges ON HR.Employees;
```

**Drop Trigger:**
```sql
DROP TRIGGER HR.trg_AuditEmployeeSalaryChanges;
```

### User-Defined Types

User-defined types allow custom data types to be created.

**Scalar User-Defined Type:**
```sql
-- Create type
CREATE TYPE Phone FROM NVARCHAR(20) NOT NULL;

-- Use type
CREATE TABLE Contacts
(
    ContactID INT PRIMARY KEY,
    Name NVARCHAR(100),
    PhoneNumber Phone
);
```

**Table-Valued Types:**
```sql
-- Create table type
CREATE TYPE EmployeeTableType AS TABLE
(
    FirstName NVARCHAR(50),
    LastName NVARCHAR(50),
    DepartmentID INT
);

-- Use table type in a procedure
CREATE PROCEDURE HR.BulkInsertEmployees
    @Employees EmployeeTableType READONLY
AS
BEGIN
    INSERT INTO HR.Employees (FirstName, LastName, DepartmentID)
    SELECT FirstName, LastName, DepartmentID
    FROM @Employees;
END;

-- Call procedure with table parameter
DECLARE @NewEmployees EmployeeTableType;

INSERT INTO @NewEmployees (FirstName, LastName, DepartmentID)
VALUES ('John', 'Smith', 1), ('Jane', 'Doe', 2);

EXEC HR.BulkInsertEmployees @NewEmployees;
```

**Drop User-Defined Type:**
```sql
DROP TYPE EmployeeTableType;
```

---

## Transaction Control Language (TCL)

### Transactions

Transactions group a set of tasks into a single execution unit that either completes entirely or not at all.

**ACID Properties:**
- **Atomicity**: All operations complete successfully, or none of them do
- **Consistency**: Database remains in a consistent state before and after transaction
- **Isolation**: Transactions are isolated from each other until completed
- **Durability**: Once a transaction is committed, it remains so

**Transaction Syntax:**
```sql
-- Basic transaction
BEGIN TRANSACTION;

UPDATE Accounts SET Balance = Balance - 100 WHERE AccountID = 1;
UPDATE Accounts SET Balance = Balance + 100 WHERE AccountID = 2;

COMMIT TRANSACTION;

-- Transaction with error handling
BEGIN TRY
    BEGIN TRANSACTION;

    UPDATE Accounts SET Balance = Balance - 100 WHERE AccountID = 1;
    UPDATE Accounts SET Balance = Balance + 100 WHERE AccountID = 2;

    COMMIT TRANSACTION;
    PRINT 'Transaction committed successfully.';
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    PRINT 'Transaction rolled back due to error: ' + ERROR_MESSAGE();
END CATCH;

-- Named transaction
BEGIN TRANSACTION TransferFunds;

UPDATE Accounts SET Balance = Balance - 100 WHERE AccountID = 1;

SAVE TRANSACTION BeforeSecondUpdate;

UPDATE Accounts SET Balance = Balance + 100 WHERE AccountID = 2;

IF @@ERROR <> 0
    ROLLBACK TRANSACTION BeforeSecondUpdate;
ELSE
    COMMIT TRANSACTION TransferFunds;
```

**Transaction Isolation Levels:**
```sql
-- Set isolation level
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET TRANSACTION ISOLATION LEVEL SNAPSHOT;

-- Example with specific isolation level
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
SELECT * FROM Accounts WHERE AccountID = 1;
-- Do something...
COMMIT TRANSACTION;
```

---

## PL/SQL & Functions

T-SQL (Transact-SQL) is Microsoft's implementation of SQL that extends the standard language. It includes procedural programming capabilities similar to PL/SQL in Oracle.

### RAND Function

The RAND function returns a random float value between 0 and 1.

**Syntax:**
```sql
-- Without seed
SELECT RAND();

-- With seed (produces repeatable sequence)
SELECT RAND(42);

-- Generate random integer between min and max
SELECT FLOOR(RAND() * (max - min + 1)) + min;
```

**Examples:**
```sql
-- Random value between 0 and 1
SELECT RAND();

-- Random integer between 1 and 100
SELECT FLOOR(RAND() * 100) + 1;

-- Random sample of records
SELECT TOP 10 *
FROM Employees
ORDER BY NEWID();
```

### Other Built-in Functions

T-SQL provides numerous built-in functions for various operations.

**String Functions:**
```sql
-- String concatenation
SELECT CONCAT(FirstName, ' ', LastName) AS FullName FROM Employees;

-- String length
SELECT LEN(FirstName) FROM Employees;

-- Substring
SELECT SUBSTRING(Email, 1, CHARINDEX('@', Email) - 1) AS Username FROM Employees;

-- Upper and lower case
SELECT UPPER(FirstName), LOWER(LastName) FROM Employees;

-- Replace
SELECT REPLACE(PhoneNumber, '-', '') FROM Employees;

-- String trimming
SELECT LTRIM(RTRIM(Description)) FROM Products;
```

**Date Functions:**
```sql
-- Current date and time
SELECT GETDATE(), SYSDATETIME();

-- Extract parts of a date
SELECT
    YEAR(HireDate) AS Year,
    MONTH(HireDate) AS Month,
    DAY(HireDate) AS Day
FROM Employees;

-- Date arithmetic
SELECT
    DATEADD(YEAR, 1, HireDate) AS OneYearAfterHire,
    DATEDIFF(DAY, HireDate, GETDATE()) AS DaysEmployed
FROM Employees;

-- Format date
SELECT FORMAT(HireDate, 'yyyy-MM-dd') FROM Employees;
```

**Mathematical Functions:**
```sql
-- Rounding
SELECT
    ROUND(Salary, -3) AS RoundedToThousands,
    CEILING(Salary) AS RoundedUp,
    FLOOR(Salary) AS RoundedDown
FROM Employees;

-- Absolute value
SELECT ABS(Balance - TargetBalance) FROM Accounts;

-- Power and square root
SELECT
    POWER(2, 10) AS PowerOfTwo,
    SQRT(144) AS SquareRoot;
```

**Conversion Functions:**
```sql
-- Convert data types
SELECT
    CAST(Salary AS INT) AS SalaryAsInt,
    CONVERT(VARCHAR(50), HireDate, 101) AS FormattedDate,
    TRY_PARSE('abc' AS INT) AS SafeParse
FROM Employees;
```

**Logical Functions:**
```sql
-- CASE expression
SELECT
    FirstName,
    Salary,
    CASE
        WHEN Salary > 80000 THEN 'High'
        WHEN Salary > 50000 THEN 'Medium'
        ELSE 'Low'
    END AS SalaryCategory
FROM Employees;

-- ISNULL and COALESCE
SELECT
    FirstName,
    ISNULL(MiddleName, 'N/A') AS MiddleName,
    COALESCE(PreferredName, FirstName) AS DisplayName
FROM Employees;

-- IIF (inline IF)
SELECT
    FirstName,
    IIF(Salary > 60000, 'Above Average', 'Below Average') AS SalaryStatus
FROM Employees;
```

**Ranking Functions:**
```sql
SELECT
    FirstName,
    Salary,
    DepartmentID,
    ROW_NUMBER() OVER(PARTITION BY DepartmentID ORDER BY Salary DESC) AS RowNum,
    RANK() OVER(PARTITION BY DepartmentID ORDER BY Salary DESC) AS SalaryRank,
    DENSE_RANK() OVER(PARTITION BY DepartmentID ORDER BY Salary DESC) AS DenseRank,
    NTILE(4) OVER(ORDER BY Salary DESC) AS Quartile
FROM Employees;
```

**Window Functions:**
```sql
SELECT
    FirstName,
    DepartmentID,
    Salary,
    AVG(Salary) OVER(PARTITION BY DepartmentID) AS AvgDeptSalary,
    SUM(Salary) OVER(PARTITION BY DepartmentID) AS TotalDeptSalary,
    Salary - AVG(Salary) OVER(PARTITION BY DepartmentID) AS DiffFromAvg
FROM Employees;
```

**System Functions:**
```sql
-- User and session information
SELECT
    USER_NAME() AS CurrentUser,
    @@SERVERNAME AS ServerName,
    @@VERSION AS SQLServerVersion;

-- Object information
SELECT
    OBJECT_ID('Employees') AS EmployeesTableID,
    SCHEMA_NAME(schema_id) AS SchemaName
FROM sys.tables
WHERE name = 'Employees';
```

---

This reference guide covers the major T-SQL concepts, syntax, and techniques. For specific database system variations or more advanced features, refer to the official documentation for your version of SQL Server.
