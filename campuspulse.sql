-- =============================================
-- CAMPUSPULSE - COMPLETE SQL REFERENCE
-- =============================================

USE campuspulse;

-- =============================================
-- 1. VIEW QUERIES
-- =============================================

-- View all users
SELECT id, name, srn, role, department, semester, year, createdAt 
FROM Users 
ORDER BY createdAt DESC;

-- View only students
SELECT id, name, srn, department, semester 
FROM Users WHERE role = 'student';

-- View only faculty
SELECT id, name, srn, department 
FROM Users WHERE role = 'faculty';

-- View only admins
SELECT id, name, srn 
FROM Users WHERE role = 'admin';

-- View all subjects
SELECT * FROM Subjects ORDER BY department, semester;

-- View CSE subjects
SELECT id, name FROM Subjects WHERE department = 'CSE' ORDER BY id;

-- View AIML subjects
SELECT id, name FROM Subjects WHERE department = 'AIML' ORDER BY id;

-- View AIDS subjects
SELECT id, name FROM Subjects WHERE department = 'AIDS' ORDER BY id;

-- View all attendance
SELECT * FROM Attendances ORDER BY date DESC;

-- View attendance for a specific student
SELECT a.date, a.status, s.name as subject
FROM Attendances a
JOIN Subjects s ON a.subject_id = s.id
WHERE a.student_id = 1
ORDER BY a.date DESC;

-- View attendance percentage per subject for a student
SELECT s.name, 
  COUNT(*) as total,
  SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present,
  ROUND(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as percentage
FROM Attendances a
JOIN Subjects s ON a.subject_id = s.id
WHERE a.student_id = 1
GROUP BY s.name;

-- View all assignments
SELECT a.id, a.title, a.deadline, a.status, s.name as subject, u.name as faculty
FROM Assignments a
LEFT JOIN Subjects s ON a.subject_id = s.id
LEFT JOIN Users u ON a.faculty_id = u.id
ORDER BY a.deadline ASC;

-- View all events
SELECT * FROM Events ORDER BY date ASC;

-- View open events
SELECT * FROM Events WHERE is_open = 1 ORDER BY date ASC;

-- View all complaints
SELECT c.id, c.category, c.description, c.status, c.upvotes, u.name as student
FROM Complaints c
LEFT JOIN Users u ON c.user_id = u.id
ORDER BY c.upvotes DESC;

-- View all notices
SELECT * FROM Notices ORDER BY createdAt DESC;

-- View all doubts
SELECT d.id, d.question, d.reply, d.is_resolved, u.name as student
FROM Doubts d
LEFT JOIN Users u ON d.student_id = u.id
ORDER BY d.createdAt DESC;

-- =============================================
-- 2. DELETE QUERIES
-- =============================================

-- Delete a user by id
DELETE FROM Users WHERE id = 1;

-- Delete a user by SRN
DELETE FROM Users WHERE srn = 'bhoomi001';

-- Delete all students
SET SQL_SAFE_UPDATES = 0;
DELETE FROM Users WHERE role = 'student';
SET SQL_SAFE_UPDATES = 1;

-- Delete all attendance for a student
SET SQL_SAFE_UPDATES = 0;
DELETE FROM Attendances WHERE student_id = 1;
SET SQL_SAFE_UPDATES = 1;

-- Delete all attendance
SET SQL_SAFE_UPDATES = 0;
DELETE FROM Attendances;
SET SQL_SAFE_UPDATES = 1;

-- Delete all notices
SET SQL_SAFE_UPDATES = 0;
DELETE FROM Notices;
SET SQL_SAFE_UPDATES = 1;

-- Delete a specific notice
DELETE FROM Notices WHERE id = 1;

-- Delete all assignments
SET SQL_SAFE_UPDATES = 0;
DELETE FROM Assignments;
SET SQL_SAFE_UPDATES = 1;

-- Delete all complaints
SET SQL_SAFE_UPDATES = 0;
DELETE FROM Complaints;
SET SQL_SAFE_UPDATES = 1;

-- Delete all doubts
SET SQL_SAFE_UPDATES = 0;
DELETE FROM Doubts;
SET SQL_SAFE_UPDATES = 1;

-- =============================================
-- 3. RESET QUERIES
-- =============================================

-- Reset auto increment for Users
ALTER TABLE Users AUTO_INCREMENT = 1;

-- Reset auto increment for all tables
ALTER TABLE Attendances AUTO_INCREMENT = 1;
ALTER TABLE Assignments AUTO_INCREMENT = 1;
ALTER TABLE Events AUTO_INCREMENT = 1;
ALTER TABLE Complaints AUTO_INCREMENT = 1;
ALTER TABLE Notices AUTO_INCREMENT = 1;
ALTER TABLE Doubts AUTO_INCREMENT = 1;
ALTER TABLE Subjects AUTO_INCREMENT = 1;

-- =============================================
-- 4. UPDATE QUERIES
-- =============================================

-- Update complaint status
UPDATE Complaints SET status = 'resolved' WHERE id = 1;

-- Update event seat count manually
UPDATE Events SET registered_count = 0 WHERE id = 1;

-- Update user role
UPDATE Users SET role = 'faculty' WHERE id = 1;

-- Update user department
UPDATE Users SET department = 'CSE' WHERE id = 1;

-- =============================================
-- 5. USEFUL DEBUG QUERIES
-- =============================================

-- Check how many students per department
SELECT department, COUNT(*) as total
FROM Users
WHERE role = 'student'
GROUP BY department;

-- Check attendance summary for all students
SELECT u.name, u.department,
  COUNT(*) as total_classes,
  SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present,
  ROUND(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as percentage
FROM Attendances a
JOIN Users u ON a.student_id = u.id
GROUP BY u.id, u.name, u.department;

-- Check event registration status
SELECT title, registered_count, seat_limit, 
  ROUND(registered_count * 100.0 / seat_limit, 1) as fill_percentage,
  is_open
FROM Events;

-- Check unresolved doubts
SELECT d.question, u.name as student, d.createdAt
FROM Doubts d
JOIN Users u ON d.student_id = u.id
WHERE d.is_resolved = 0
ORDER BY d.createdAt DESC;

-- Check pending complaints with most upvotes
SELECT c.description, c.category, c.upvotes, u.name as student
FROM Complaints c
JOIN Users u ON c.user_id = u.id
WHERE c.status = 'pending'
ORDER BY c.upvotes DESC;

-- Check overdue assignments
SELECT a.title, a.deadline, s.name as subject, s.department
FROM Assignments a
JOIN Subjects s ON a.subject_id = s.id
WHERE a.deadline < NOW() AND a.status != 'submitted'
ORDER BY a.deadline ASC;