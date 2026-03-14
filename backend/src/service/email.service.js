import nodemailer from 'nodemailer';
// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});


// TODO: Update the email templates for courseAssignedToTeacher and teacherAssignedToCourse

// Email templates
const templates = {
  welcomeTeacher: (data) => ({
    subject: 'Welcome to the Academix',
    html: `
    <h1>Welcome ${data.name}!</h1>
    <p>Your teacher account has been created successfully by an administrator.</p>
    <p><strong>Account Details:</strong></p>
    <ul>
      <li>Email: ${data.email}</li>
      <li>Phone: ${data.phone}</li>
      <li>Post: ${data.post}</li>
      <li>Address: ${data.address || 'Not provided'}</li>
      <li>Assigned Courses: ${(data.coursesCount > 0 ? data.coursesCount : 'Not assigned')}</li>
    </ul>
  `,
  }),

  welcomeStudent: (data) => ({
    subject: 'Welcome to the Academix',
    html: `
    <h1>Welcome ${data.name}!</h1>
    <p>Your student account has been created successfully by an administrator.</p>
    <p><strong>Account Details:</strong></p>
    <ul>
      <li>Email: ${data.email}</li>
      <li>Phone: ${data.phone}</li>
      <li>Shift: ${data.shift}</li>
      <li>Address: ${data.address || 'Not provided'}</li>
      <li>Enrolled Courses: ${(data.coursesCount > 0 ? data.coursesCount : 'Not enrolled')}</li>
    </ul>
  `,
  }),

  adminLoginAlert: (data) => ({
    subject: 'Admin Login Alert',
    html: `
      <h2>Admin Login Detected</h2>
      <p>An admin user logged into the system:</p>
      <ul>
        <li><strong>Admin:</strong> ${data.name} (${data.email})</li>
        <li><strong>Time:</strong> ${data.timestamp}</li>
        <li><strong>IP Address:</strong> ${data.ipAddress}</li>
        <li><strong>User Agent:</strong> ${data.userAgent}</li>
      </ul>
      <p>If this wasn't you, please contact IT immediately.</p>
    `,
  }),

  userRegistered: (data) => ({
    subject: 'New User Registration',
    html: `
      <h2>New User Registered</h2>
      <p>A new user has registered in the system:</p>
      <ul>
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Role:</strong> ${data.role}</li>
        <li><strong>Time:</strong> ${data.timestamp}</li>
      </ul>
    `,
  }),

  courseAssignedTeacher: (data) => ({
    subject: 'New Course Assignment',
    html: `
      <h2>Course Assigned to You</h2>
      <p>Dear ${data.teacherName},</p>
      <p>You have been assigned to teach the following course:</p>
      <ul>
        <li><strong>Course:</strong> ${data.courseName}</li>
        <li><strong>Course Code:</strong> ${data.courseCode}</li>
        <li><strong>Schedule:</strong> ${data.schedule}</li>
        <li><strong>Semester:</strong> ${data.semester}</li>
      </ul>
      <p>Please login to the system to view your students and course materials.</p>
    `,
  }),

  courseAssignedStudent: (data) => ({
    subject: 'Course Registration Confirmation',
    html: `
      <h2>Course Registration Confirmed</h2>
      <p>Dear ${data.studentName},</p>
      <p>You have been successfully registered for:</p>
      <ul>
        <li><strong>Course:</strong> ${data.courseName}</li>
        <li><strong>Course Code:</strong> ${data.courseCode}</li>
        <li><strong>Instructor:</strong> ${data.instructor}</li>
        <li><strong>Schedule:</strong> ${data.schedule}</li>
      </ul>
      <p>Login to the system to access course materials.</p>
    `,
  }),
};

// TODO: Update the function for courseAssignedToTeacher and teacherAssignedToCourse

// Generic send email function
const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Specific email functions
const sendProfileCreatedEmail = async (user, role) => {
  let emailData = {
    name: user.name,
    email: user.email,
    phone: user.phone,
  };

  // Add role-specific data
  if (role === 'student') {
    emailData = {
      ...emailData,
      shift: user.shift,
      address: user.address,
      coursesCount: user.courses?.length || 0,
    };
  } else if (role === 'teacher') {
    emailData = {
      ...emailData,
      post: user.post,
      address: user.address,
      coursesCount: user.courseId?.length || 0,
    };
  }

  const template = role === 'teacher' ? templates.welcomeTeacher : templates.welcomeStudent;

  return sendEmail({
    to: user.email,
    ...template(emailData),
  });
};

const sendAdminLoginAlert = async (admin, req) => {
  return sendEmail({
    to: admin.email,
    ...templates.adminLoginAlert({
      name: admin.name,
      email: admin.email,
      timestamp: new Date().toLocaleString(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    }),
  });
};

const sendUserRegisteredAlert = async (newUser) => {
  return sendEmail({
    to: newUser.email,
    ...templates.userRegistered({
      name: newUser.name,
      email: newUser.email,
      role: "Admin",
      timestamp: new Date().toLocaleString(),
    }),
  });
};

const sendCourseAssignedEmail = async (assignment) => {
  if (assignment.type === 'teacher') {
    return sendEmail({
      to: assignment.teacher.email,
      ...templates.courseAssignedTeacher({
        teacherName: assignment.teacher.name,
        courseName: assignment.course.name,
        courseCode: assignment.course.code,
        schedule: assignment.course.schedule,
        semester: assignment.semester,
      }),
    });
  } else {
    return sendEmail({
      to: assignment.student.email,
      ...templates.courseAssignedStudent({
        studentName: assignment.student.name,
        courseName: assignment.course.name,
        courseCode: assignment.course.code,
        instructor: assignment.course.instructor,
        schedule: assignment.course.schedule,
      }),
    });
  }
};

export {
  sendEmail,
  sendProfileCreatedEmail,
  sendAdminLoginAlert,
  sendUserRegisteredAlert,
  sendCourseAssignedEmail,
};