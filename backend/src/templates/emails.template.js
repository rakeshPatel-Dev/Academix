const templates = {
  welcomeTeacher: (data) => ({
    subject: `Welcome to Academix, ${data.name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">Welcome to Academix!</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <p>Dear <strong>${escapeHtml(data.name)}</strong>,</p>
          <p>Your teacher account has been successfully created by an administrator. You can now log in to the Academix platform to manage your courses and students.</p>
          
          <h3 style="color: #4CAF50;">Account Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(data.email)}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(data.phone)}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Position:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(data.post)}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Address:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(data.address || 'Not provided')}</td></tr>
            <tr><td style="padding: 8px;"><strong>Assigned Courses:</strong></td><td style="padding: 8px;">${data.coursesCount > 0 ? `<span style="color: #4CAF50; font-weight: bold;">${data.coursesCount}</span>` : '<span style="color: #ff9800;">Not assigned yet</span>'}</td></tr>
          </table>
          
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">If you have any questions, please contact your administrator.</p>
        </div>
      </div>
    `,
  }),

  welcomeStudent: (data) => ({
    subject: `Welcome to Academix, ${data.name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2196F3; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">Welcome to Academix!</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <p>Dear <strong>${escapeHtml(data.name)}</strong>,</p>
          <p>Your student account has been successfully created by an administrator. You can now log in to access your courses and learning materials.</p>
          
          <h3 style="color: #2196F3;">Account Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(data.email)}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(data.phone)}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Shift:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(data.shift)}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Address:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${escapeHtml(data.address || 'Not provided')}</td></tr>
            <tr><td style="padding: 8px;"><strong>Enrolled Courses:</strong></td><td style="padding: 8px;">${data.coursesCount > 0 ? `<span style="color: #2196F3; font-weight: bold;">${data.coursesCount}</span>` : '<span style="color: #ff9800;">Not enrolled yet</span>'}</td></tr>
          </table>
          
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Need help? Contact your academic advisor or the support team.</p>
        </div>
      </div>
    `,
  }),

  adminLoginAlert: (data) => ({
    subject: `🔐 Security Alert: Admin Login from ${data.location || 'Unknown Location'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f44336; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">⚠️ Admin Login Alert</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <p>An administrator account was used to log into the system:</p>
          
          <table style="width: 100%; border-collapse: collapse; background-color: #f9f9f9; margin: 15px 0;">
            <tr><td style="padding: 10px;"><strong>Admin Name:</strong></td><td style="padding: 10px;">${escapeHtml(data.name)}</td></tr>
            <tr><td style="padding: 10px;"><strong>Email:</strong></td><td style="padding: 10px;">${escapeHtml(data.email)}</td></tr>
            <tr><td style="padding: 10px;"><strong>Time:</strong></td><td style="padding: 10px;">${escapeHtml(data.timestamp)}</td></tr>
            <tr><td style="padding: 10px;"><strong>IP Address:</strong></td><td style="padding: 10px;">${escapeHtml(data.ipAddress)}</td></tr>
            <tr><td style="padding: 10px;"><strong>Location:</strong></td><td style="padding: 10px;">${escapeHtml(data.location || 'Not available')}</td></tr>
            <tr><td style="padding: 10px;"><strong>Browser/Device:</strong></td><td style="padding: 10px;">${escapeHtml(data.userAgent)}</td></tr>
          </table>
          
          <div style="background-color: #ffeb3b; padding: 15px; border-left: 4px solid #f44336; margin: 15px 0;">
            <strong style="color: #f44336;">⚠️ If this wasn't you:</strong>
            <p style="margin: 5px 0 0 0;">Please contact IT immediately at <a href="mailto:it@academix.com">it@academix.com</a> or call +1 (555) 123-4567.</p>
          </div>
          
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated security notification. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  }),

  userRegistered: (data) => ({
    subject: `📝 New User Registration: ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #9C27B0; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">New User Registration</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <p>A new user has registered in the Academix system:</p>
          
          <table style="width: 100%; border-collapse: collapse; background-color: #f9f9f9; margin: 15px 0;">
            <tr><td style="padding: 10px;"><strong>Name:</strong></td><td style="padding: 10px;">${escapeHtml(data.name)}</td></tr>
            <tr><td style="padding: 10px;"><strong>Email:</strong></td><td style="padding: 10px;">${escapeHtml(data.email)}</td></tr>
            <tr><td style="padding: 10px;"><strong>Role:</strong></td><td style="padding: 10px;"><span style="background-color: #9C27B0; color: white; padding: 3px 8px; border-radius: 3px;">${escapeHtml(data.role)}</span></td></tr>
            <tr><td style="padding: 10px;"><strong>Registration Time:</strong></td><td style="padding: 10px;">${escapeHtml(data.timestamp)}</td></tr>
          </table>
          
          <p>Please review and approve this registration if necessary.</p>
          
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated notification from Academix system.</p>
        </div>
      </div>
    `,
  }),

  emailVerificationCode: (data) => ({
    subject: `🔑 ${data.code} - Verify Your Email Address`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #FF9800; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">Email Verification</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none; text-align: center;">
          <p>Dear <strong>${escapeHtml(data.name)}</strong>,</p>
          <p>Please use the verification code below to verify your email address:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; font-size: 32px; letter-spacing: 5px; font-weight: bold; font-family: monospace;">
            ${escapeHtml(data.code)}
          </div>
          
          <div style="background-color: #ffeb3b; padding: 10px; margin: 15px 0;">
            <strong>⏰ This code will expire in 10 minutes</strong>
          </div>
          
          <p>If you didn't request this verification, please ignore this email.</p>
          
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Academix - Your Learning Platform</p>
        </div>
      </div>
    `,
  }),

  resetPassword: (data) => ({
    subject: `🔒 ${data.code} - Password Reset Code`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f44336; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">Password Reset Request</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none; text-align: center;">
          <p>Dear <strong>${escapeHtml(data.name)}</strong>,</p>
          <p>We received a request to reset your password for the email address:</p>
          <p><strong>${escapeHtml(data.email)}</strong></p>
          
          <p>Use the code below to reset your password:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; font-size: 32px; letter-spacing: 5px; font-weight: bold; font-family: monospace;">
            ${escapeHtml(data.code)}
          </div>
          
          <div style="background-color: #ffeb3b; padding: 10px; margin: 15px 0;">
            <strong>⏰ This code will expire in 10 minutes</strong>
          </div>
          
          <p>If you didn't request this password reset, please ignore this email or contact support.</p>
          
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Academix - Secure Password Recovery</p>
        </div>
      </div>
    `,
  }),

  courseAssignedTeacher: (data) => ({
    subject: `📚 New Course Assignment: ${data.courseName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">New Course Assignment</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <p>Dear <strong>${escapeHtml(data.teacherName)}</strong>,</p>
          <p>You have been assigned to teach the following course:</p>
          
          <table style="width: 100%; border-collapse: collapse; background-color: #f9f9f9; margin: 15px 0;">
            <tr><td style="padding: 10px;"><strong>Course Name:</strong></td><td style="padding: 10px;">${escapeHtml(data.courseName)}</td></tr>
            <tr><td style="padding: 10px;"><strong>Course Code:</strong></td><td style="padding: 10px;">${escapeHtml(data.courseCode)}</td></tr>
            <tr><td style="padding: 10px;"><strong>Schedule:</strong></td><td style="padding: 10px;">${escapeHtml(data.schedule)}</td></tr>
            <tr><td style="padding: 10px;"><strong>Semester:</strong></td><td style="padding: 10px;">${escapeHtml(data.semester)}</td></tr>
          </table>
          
          <div style="background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4CAF50;">
            <strong>Next Steps:</strong>
            <ul style="margin: 5px 0 0 20px;">
              <li>Login to your teacher dashboard</li>
              <li>Review the course materials</li>
              <li>Access your student list</li>
              <li>Prepare your first lecture</li>
            </ul>
          </div>
          
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Login at: <a href="https://academix.com/teacher">https://academix.com/teacher</a></p>
        </div>
      </div>
    `,
  }),

  courseAssignedStudent: (data) => ({
    subject: `✅ Course Registration Confirmed: ${data.courseName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2196F3; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">Course Registration Confirmed!</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <p>Dear <strong>${escapeHtml(data.studentName)}</strong>,</p>
          <p>Congratulations! You have been successfully registered for the following course:</p>
          
          <table style="width: 100%; border-collapse: collapse; background-color: #f9f9f9; margin: 15px 0;">
            <tr><td style="padding: 10px;"><strong>Course Name:</strong></td><td style="padding: 10px;">${escapeHtml(data.courseName)}</td></tr>
            <tr><td style="padding: 10px;"><strong>Course Code:</strong></td><td style="padding: 10px;">${escapeHtml(data.courseCode)}</td></tr>
            <tr><td style="padding: 10px;"><strong>Instructor:</strong></td><td style="padding: 10px;">${escapeHtml(data.instructor)}</td></tr>
            <tr><td style="padding: 10px;"><strong>Schedule:</strong></td><td style="padding: 10px;">${escapeHtml(data.schedule)}</td></tr>
          </table>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196F3;">
            <strong>Getting Started:</strong>
            <ul style="margin: 5px 0 0 20px;">
              <li>Login to your student portal</li>
              <li>Access course materials and syllabus</li>
              <li>Join the course discussion forum</li>
              <li>Check assignment deadlines</li>
            </ul>
          </div>
          
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Login at: <a href="https://academix.com/student">https://academix.com/student</a></p>
          <p style="color: #666; font-size: 12px;">Questions? Contact your instructor at ${escapeHtml(data.instructorEmail) || 'support@academix.com'}</p>
        </div>
      </div>
    `,
  }),
};

// Helper function to prevent XSS attacks
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default templates;