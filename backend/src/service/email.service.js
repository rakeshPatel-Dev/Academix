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
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId, to };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message, to };
  }
};

// ==================== REGISTRATION EMAILS ====================

const sendRegistrationEmail = async (user, role) => {
  const emailData = {
    name: user.name,
    email: user.email,
    timestamp: new Date().toLocaleString(),
  };

  switch (role) {
    case 'admin':
      return sendEmail({
        to: user.email,
        ...templates.adminRegistered({
          ...emailData,
          role: 'Administrator',
        }),
      });

    case 'teacher':
      return sendEmail({
        to: user.email,
        ...templates.welcomeTeacher({
          ...emailData,
          phone: user.phone,
          post: user.post,
          address: user.address,
          coursesCount: user.courseId?.length || 0,
        }),
      });

    case 'student':
      return sendEmail({
        to: user.email,
        ...templates.welcomeStudent({
          ...emailData,
          phone: user.phone,
          shift: user.shift,
          address: user.address,
          coursesCount: user.courses?.length || 0,
        }),
      });

    case 'user':
    default:
      return sendEmail({
        to: user.email,
        ...templates.userRegistered({
          ...emailData,
          role: 'User',
        }),
      });
  }
};

// ==================== LOGIN ALERT EMAILS ====================

const sendLoginAlertEmail = async (user, req) => {
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.ip
    || req.socket?.remoteAddress;

  const loginData = {
    name: user.name,
    email: user.email,
    timestamp: new Date().toLocaleString(),
    ipAddress: clientIp,
    location: req.headers['cf-ipcountry'] || req.headers['x-geoip-country'] || 'Unknown',
    userAgent: req.headers['user-agent'],
  };

  switch (user.role) {
    case 'admin':
      return sendEmail({
        to: user.email,
        ...templates.adminLoginAlert({
          ...loginData,
          role: 'Administrator',
        }),
      });

    case 'user':
      return sendEmail({
        to: user.email,
        ...templates.userLoginAlert({
          ...loginData,
          role: 'User',
        }),
      });

    case 'teacher':
    case 'student':
    default:
      // Teachers and students get the standard user login alert
      return sendEmail({
        to: user.email,
        ...templates.userLoginAlert({
          ...loginData,
          role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        }),
      });
  }
};

// ==================== OTP EMAILS ====================

const sendOtpEmail = async (user, otpCode) => {
  const otpData = {
    name: user.name,
    email: user.email,
    code: otpCode,
  };

  switch (user.role) {
    case 'admin':
      return sendEmail({
        to: user.email,
        ...templates.otpLoginAdmin({
          ...otpData,
          role: 'Administrator',
        }),
      });

    case 'user':
    case 'teacher':
    case 'student':
    default:
      return sendEmail({
        to: user.email,
        ...templates.otpLogin({
          ...otpData,
          role: user.role || 'User',
        }),
      });
  }
};

// ==================== VERIFICATION EMAILS ====================

const sendVerificationEmail = async (user) => {
  return sendEmail({
    to: user.email,
    ...templates.emailVerificationCode({
      name: user.name,
      email: user.email,
      code: user.verificationCode,
    }),
  });
};

// ==================== PASSWORD RESET EMAILS ====================

const sendPasswordResetEmail = async (user) => {
  return sendEmail({
    to: user.email,
    ...templates.resetPassword({
      name: user.name,
      email: user.email,
      code: user.resetCode || user.verificationCode,
    }),
  });
};

// ==================== COURSE ASSIGNMENT EMAILS ====================

const sendCourseAssignmentEmail = async (assignment) => {
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
  } else if (assignment.type === 'student') {
    return sendEmail({
      to: assignment.student.email,
      ...templates.courseAssignedStudent({
        studentName: assignment.student.name,
        courseName: assignment.course.name,
        courseCode: assignment.course.code,
        instructor: assignment.course.instructor,
        schedule: assignment.course.schedule,
        instructorEmail: assignment.course.instructorEmail,
      }),
    });
  }
  return { success: false, error: 'Invalid assignment type' };
};

// ==================== MONITORING EMAILS (For Super Admin) ====================

const sendAdminLoginMonitorEmail = async (admin, req, superAdminEmail) => {
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.ip
    || req.socket?.remoteAddress;

  return sendEmail({
    to: superAdminEmail,
    ...templates.adminLoginAlertForSuperAdmin({
      name: admin.name,
      email: admin.email,
      role: 'Administrator',
      timestamp: new Date().toLocaleString(),
      ipAddress: clientIp,
      location: req.headers['cf-ipcountry'] || req.headers['x-geoip-country'] || 'Unknown',
      userAgent: req.headers['user-agent'],
    }),
  });
};

// ==================== EXPORTS ====================

export {
  // Core function
  sendEmail,

  // Individual senders
  sendRegistrationEmail,
  sendLoginAlertEmail,
  sendOtpEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendCourseAssignmentEmail,
  sendAdminLoginMonitorEmail,
};