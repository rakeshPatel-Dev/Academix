import templates from '../templates/emails.template.js';
import transporter from '../config/email.config.js';

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

  const validRoles = ['student', 'teacher'];
  if (!validRoles.includes(role)) {
    console.error(`Invalid role for profile email: ${role}`);
    return { success: false, error: `Invalid role: ${role}` };
  }

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

// send admin login alert
const sendAdminLoginAlert = async (admin, req) => {

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.ip
    || req.socket?.remoteAddress;


  return sendEmail({
    to: admin.email,
    ...templates.adminLoginAlert({
      name: admin.name,
      email: admin.email,
      timestamp: new Date().toLocaleString(),
      ipAddress: clientIp,
      userAgent: req.headers['user-agent'],
    }),
  });
};

// send user registered alert
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

// send verification code
const sendVerificationCodeEmail = async (admin) => {
  return sendEmail({
    to: admin.email,
    ...templates.emailVerificationCode({
      name: admin.name,
      code: admin.verificationCode
    }),
  });
};

// send reset code
const sendResetCodeEmail = async (admin) => {
  return sendEmail({
    to: admin.email,
    ...templates.resetPassword({
      name: admin.name,
      email: admin.email,
      code: admin.verificationCode
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
  sendVerificationCodeEmail,
  sendResetCodeEmail,
  sendUserRegisteredAlert,
  sendCourseAssignedEmail,
};