// Base template components for consistency
const brandConfig = {
  name: 'Academix',
  tagline: 'Empowering Education',
  logoUrl: 'https://academix.rakeshpatel.me/logo.png', // Add your logo URL
  primaryColor: '#4A90E2',
  websiteUrl: 'https://academix.rakeshpatel.me',
  supportEmail: 'dev@rakeshpatel.me',
  socialLinks: {
    twitter: 'https://twitter.com/rakeshpatel',
    linkedin: 'https://linkedin.com/in/rakeshpatel-developer',
    facebook: 'https://facebook.com/rakeshthedev'
  }
};

// Reusable header component
const getHeader = (title, subtitle, backgroundColor = brandConfig.primaryColor) => `
  <div style="background-color: ${backgroundColor}; padding: 30px 20px; text-align: center; color: white;">
    <h1 style="margin: 0; font-size: 28px;">${title}</h1>
    ${subtitle ? `<p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">${subtitle}</p>` : ''}
  </div>
`;

// Reusable footer component
const getFooter = () => `
  <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
    <div style="margin-bottom: 15px;">
      <a href="${brandConfig.websiteUrl}" style="color: ${brandConfig.primaryColor}; text-decoration: none; margin: 0 10px;">Home</a>
      <a href="${brandConfig.websiteUrl}/privacy" style="color: ${brandConfig.primaryColor}; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
      <a href="${brandConfig.websiteUrl}/terms" style="color: ${brandConfig.primaryColor}; text-decoration: none; margin: 0 10px;">Terms of Service</a>
      <a href="mailto:${brandConfig.supportEmail}" style="color: ${brandConfig.primaryColor}; text-decoration: none; margin: 0 10px;">Support</a>
    </div>
    <p style="color: #666; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} ${brandConfig.name}. All rights reserved.</p>
    <p style="color: #999; font-size: 11px; margin: 10px 0 0 0;">${brandConfig.tagline}</p>
    <p style="color: #999; font-size: 11px; margin: 10px 0 0 0;">
      <em>This is an automated message. Please do not reply to this email.</em>
    </p>
  </div>
`;

// Reusable body container
const getBodyContainer = (content) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    ${content}
  </div>
`;

// Reusable greeting
const getGreeting = (name) => `
  <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">
    Dear <strong>${escapeHtml(name)}</strong>,
  </p>
`;

// Reusable info table
const getInfoTable = (rows) => `
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #fafafa; border-radius: 8px; overflow: hidden;">
    ${rows.map(row => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 15px; font-weight: bold; width: 40%; background-color: #f5f5f5;">${row.label}</td>
        <td style="padding: 12px 15px; color: #555;">${row.value}</td>
      </tr>
    `).join('')}
  </table>
`;

// Reusable code display
const getCodeDisplay = (code) => `
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3px; margin: 20px 0; border-radius: 12px;">
    <div style="background-color: white; padding: 20px; text-align: center; border-radius: 9px;">
      <div style="font-size: 36px; letter-spacing: 8px; font-weight: bold; font-family: 'Courier New', monospace; color: #333;">
        ${escapeHtml(code)}
      </div>
    </div>
  </div>
`;

// Reusable alert box
const getAlertBox = (message, type = 'warning') => {
  const colors = {
    warning: { bg: '#fff3cd', border: '#ffc107', text: '#856404' },
    info: { bg: '#d1ecf1', border: '#17a2b8', text: '#0c5460' },
    success: { bg: '#d4edda', border: '#28a745', text: '#155724' },
    danger: { bg: '#f8d7da', border: '#dc3545', text: '#721c24' }
  };
  const color = colors[type] || colors.info;
  return `
    <div style="background-color: ${color.bg}; padding: 15px; margin: 20px 0; border-left: 4px solid ${color.border}; border-radius: 4px;">
      <p style="margin: 0; color: ${color.text}; font-size: 14px;">${message}</p>
    </div>
  `;
};

// Reusable button
const getButton = (text, url) => `
  <div style="text-align: center; margin: 25px 0;">
    <a href="${url}" style="background-color: ${brandConfig.primaryColor}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
      ${text}
    </a>
  </div>
`;

// Main templates object
const templates = {
  welcomeTeacher: (data) => ({
    subject: `Welcome to ${brandConfig.name}, ${data.name}!`,
    html: getBodyContainer(`
      ${getHeader('Welcome to Academix!', 'Your teacher account has been created', '#4CAF50')}
      <div style="padding: 30px 25px;">
        ${getGreeting(data.name)}
        <p style="margin: 0 0 15px 0;">Your teacher account has been successfully created by an administrator. You can now log in to the Academix platform to manage your courses and students.</p>
        
        <h3 style="color: #4CAF50; margin: 25px 0 15px 0;">📋 Account Details:</h3>
        ${getInfoTable([
      { label: 'Email', value: data.email },
      { label: 'Phone', value: data.phone },
      { label: 'Position', value: data.post },
      { label: 'Address', value: data.address || 'Not provided' },
      { label: 'Assigned Courses', value: data.coursesCount > 0 ? `<span style="color: #4CAF50; font-weight: bold;">${data.coursesCount}</span>` : '<span style="color: #ff9800;">Not assigned yet</span>' }
    ])}
        
        ${getButton('Access Teacher Dashboard', `${brandConfig.websiteUrl}/teacher/dashboard`)}
        
        ${getAlertBox('If you have any questions, please contact your administrator.', 'info')}
      </div>
      ${getFooter()}
    `),
  }),

  welcomeStudent: (data) => ({
    subject: `Welcome to ${brandConfig.name}, ${data.name}!`,
    html: getBodyContainer(`
      ${getHeader('Welcome to Academix!', 'Your student account has been created', '#2196F3')}
      <div style="padding: 30px 25px;">
        ${getGreeting(data.name)}
        <p style="margin: 0 0 15px 0;">Your student account has been successfully created by an administrator. You can now log in to access your courses and learning materials.</p>
        
        <h3 style="color: #2196F3; margin: 25px 0 15px 0;">📋 Account Details:</h3>
        ${getInfoTable([
      { label: 'Email', value: data.email },
      { label: 'Phone', value: data.phone },
      { label: 'Shift', value: data.shift },
      { label: 'Address', value: data.address || 'Not provided' },
      { label: 'Enrolled Courses', value: data.coursesCount > 0 ? `<span style="color: #2196F3; font-weight: bold;">${data.coursesCount}</span>` : '<span style="color: #ff9800;">Not enrolled yet</span>' }
    ])}
        
        ${getButton('Access Student Portal', `${brandConfig.websiteUrl}/student/dashboard`)}
        
        ${getAlertBox('Need help? Contact your academic advisor or the support team.', 'info')}
      </div>
      ${getFooter()}
    `),
  }),

  // Welcome email for new user (view-only access)
  userRegistered: (data) => ({
    subject: `🎉 Welcome to ${brandConfig.name}, ${data.name}!`,
    html: getBodyContainer(`
    ${getHeader('Welcome to Academix!', 'Your account has been created', '#9C27B0')}
    <div style="padding: 30px 25px;">
      ${getGreeting(data.name)}
      <p style="margin: 0 0 15px 0;">Thank you for registering with Academix! Your account has been successfully created. Below are your account details and permissions:</p>
      
      ${getInfoTable([
      { label: 'Name', value: data.name },
      { label: 'Email', value: data.email },
      { label: 'Role', value: `<span style="background-color: #9C27B0; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">${escapeHtml(data.role)}</span>` },
      { label: 'Registration Time', value: data.timestamp }
    ])}
      
      <h3 style="color: #9C27B0; margin: 25px 0 15px 0;">🔐 Your Access Permissions</h3>
      
      <div style="margin: 15px 0; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
        <strong style="color: #333;">As a ${escapeHtml(data.role)} user, you can:</strong>
        <ul style="margin: 10px 0 0 20px; color: #555;">
          <li>✓ Browse and view all courses</li>
          <li>✓ View teacher and student information</li>
          <li>✓ Explore the Academix platform features</li>
          <li>✓ See how the system manages educational data</li>
          <li>✓ Test and evaluate the platform's capabilities</li>
        </ul>
      </div>
      
      <div style="margin: 15px 0; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <strong style="color: #856404;">ℹ️ Important Note:</strong>
        <p style="margin: 8px 0 0 0; color: #856404; font-size: 14px;">
          Your account has view-only access. You can explore and evaluate all features of the Academix platform, but you cannot create, modify, or delete any data (teachers, courses, students, etc.).
        </p>
      </div>
      
      ${getButton('Start Exploring', `${brandConfig.websiteUrl}/dashboard`)}
      
      ${getAlertBox('Need help exploring the platform? Contact us at support@academix.com', 'info')}
    </div>
    ${getFooter()}
  `),
  }),

  // Welcome email for new admin (full access)
  adminRegistered: (data) => ({
    subject: `🔐 Welcome to ${brandConfig.name} Admin Panel, ${data.name}!`,
    html: getBodyContainer(`
    ${getHeader('Welcome Admin!', 'Your administrator account has been created', '#f44336')}
    <div style="padding: 30px 25px;">
      ${getGreeting(data.name)}
      <p style="margin: 0 0 15px 0;">Your administrator account has been successfully created. You now have full control over the Academix platform.</p>
      
      ${getInfoTable([
      { label: 'Name', value: data.name },
      { label: 'Email', value: data.email },
      { label: 'Role', value: `<span style="background-color: #f44336; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">Administrator</span>` },
      { label: 'Registration Time', value: data.timestamp },
      { label: 'Account Type', value: 'Full Access / Super Admin' }
    ])}
      
      <h3 style="color: #f44336; margin: 25px 0 15px 0;">⚡ Your Administrator Permissions</h3>
      
      <div style="margin: 15px 0; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
        <strong style="color: #333;">As an Administrator, you have full control:</strong>
        <ul style="margin: 10px 0 0 20px; color: #555;">
          <li>✓ Full access to all platform features</li>
          <li>✓ Create, update, and delete teachers</li>
          <li>✓ Create, update, and delete courses</li>
          <li>✓ Create, update, and delete students</li>
          <li>✓ Manage user accounts and permissions</li>
          <li>✓ Generate reports and analytics</li>
          <li>✓ Configure system settings</li>
          <li>✓ View all system activities</li>
        </ul>
      </div>
      
      <div style="margin: 15px 0; padding: 15px; background-color: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;">
        <strong style="color: #2e7d32;">✅ Getting Started:</strong>
        <ul style="margin: 10px 0 0 20px; color: #555;">
          <li>Log in to your admin dashboard</li>
          <li>Start adding teachers and courses</li>
          <li>Manage student enrollments</li>
          <li>Configure platform settings</li>
        </ul>
      </div>
      
      ${getButton('Access Admin Panel', `${brandConfig.websiteUrl}/admin/dashboard`)}
      
      ${getAlertBox('⚠️ Keep your login credentials secure. This account has full system access.', 'danger')}
    </div>
    ${getFooter()}
  `),
  }),

  // Login alert for regular user (view-only)
  userLoginAlert: (data) => ({
    subject: `🔐 Login Notification: Welcome back, ${data.name}!`,
    html: getBodyContainer(`
    ${getHeader('🔐 New Login Detected', 'Account Activity', '#9C27B0')}
    <div style="padding: 30px 25px;">
      ${getGreeting(data.name)}
      <p style="margin: 0 0 15px 0;">Your account was just used to log into the Academix platform. Here are the login details:</p>
      
      ${getInfoTable([
      { label: 'Name', value: data.name },
      { label: 'Email', value: data.email },
      { label: 'Role', value: `<span style="background-color: #9C27B0; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">${escapeHtml(data.role)}</span>` },
      { label: 'Time', value: data.timestamp },
      { label: 'IP Address', value: data.ipAddress },
      { label: 'Location', value: data.location || 'Not available' },
      { label: 'Browser/Device', value: data.userAgent }
    ])}
      
      <div style="margin: 20px 0; padding: 15px; background-color: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">
        <strong style="color: #1976d2;">ℹ️ Your Access Level:</strong>
        <p style="margin: 8px 0 0 0; color: #555;">
          You have view-only access to explore the platform. You can browse courses, view teacher and student information, but cannot create, modify, or delete any data.
        </p>
      </div>
      
      ${getAlertBox('⚠️ If this wasn\'t you, please contact support immediately at support@academix.com', 'warning')}
      
      ${getButton('Go to Dashboard', `${brandConfig.websiteUrl}/dashboard`)}
      
      <p style="margin: 20px 0 0 0; font-size: 12px; color: #999;">
        This notification was sent to ${data.email} for security purposes.
      </p>
    </div>
    ${getFooter()}
  `),
  }),

  // Login alert for admin (full access)
  adminLoginAlert: (data) => ({
    subject: `🔐 Admin Login Alert: Welcome back, ${data.name}!`,
    html: getBodyContainer(`
    ${getHeader('🔐 Admin Login Detected', 'Security Notification', '#f44336')}
    <div style="padding: 30px 25px;">
      ${getGreeting(data.name)}
      <p style="margin: 0 0 15px 0;">Your administrator account was just used to log into the Academix system. Here are the login details:</p>
      
      ${getInfoTable([
      { label: 'Admin Name', value: data.name },
      { label: 'Email', value: data.email },
      { label: 'Role', value: '<span style="background-color: #f44336; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">Administrator</span>' },
      { label: 'Time', value: data.timestamp },
      { label: 'IP Address', value: data.ipAddress },
      { label: 'Location', value: data.location || 'Not available' },
      { label: 'Browser/Device', value: data.userAgent }
    ])}
      
      <div style="margin: 20px 0; padding: 15px; background-color: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;">
        <strong style="color: #2e7d32;">✅ Your Admin Permissions:</strong>
        <ul style="margin: 10px 0 0 20px; color: #555;">
          <li>✓ Full access to all platform features</li>
          <li>✓ Create, update, and delete teachers, courses, and students</li>
          <li>✓ Manage user accounts and permissions</li>
          <li>✓ Generate reports and analytics</li>
          <li>✓ Configure system settings</li>
        </ul>
      </div>
      
      ${getAlertBox('⚠️ If this wasn\'t you, please contact IT immediately at it@academix.com', 'danger')}
      
      ${getButton('Access Admin Panel', `${brandConfig.websiteUrl}/admin/dashboard`)}
      
      <p style="margin: 20px 0 0 0; font-size: 12px; color: #999;">
        This notification was sent to ${data.email} because this account has administrator privileges.
      </p>
    </div>
    ${getFooter()}
  `),
  }),

  // For superadmin to monitor all admin logins
  adminLoginAlertForSuperAdmin: (data) => ({
    subject: `🔐 Security Monitor: Admin Login from ${data.location || 'Unknown Location'}`,
    html: getBodyContainer(`
    ${getHeader('⚠️ Admin Login Monitor', 'Security Notification for Super Admin', '#f44336')}
    <div style="padding: 30px 25px;">
      <p style="margin: 0 0 15px 0;">An administrator account was used to log into the system. Please review the details below:</p>
      
      ${getInfoTable([
      { label: 'Admin Name', value: data.name },
      { label: 'Email', value: data.email },
      { label: 'Role', value: '<span style="background-color: #f44336; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">Administrator</span>' },
      { label: 'Time', value: data.timestamp },
      { label: 'IP Address', value: data.ipAddress },
      { label: 'Location', value: data.location || 'Not available' },
      { label: 'Browser/Device', value: data.userAgent }
    ])}
      
      <div style="margin: 20px 0; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <strong style="color: #856404;">ℹ️ This is an automated security notification for super admin monitoring.</strong>
        <p style="margin: 8px 0 0 0; color: #856404;">
          No action is required if this was an authorized login.
        </p>
      </div>
      
      ${getAlertBox('⚠️ If this login was unauthorized, please take immediate action to secure the account.', 'danger')}
      
      ${getButton('View Admin Logs', `${brandConfig.websiteUrl}/superadmin/logs`)}
    </div>
    ${getFooter()}
  `),
  }),

  // OTP login for regular users
  otpLogin: (data) => ({
    subject: `🔑 ${data.code} - Your One-Time Password for ${brandConfig.name} Login`,
    html: getBodyContainer(`
    ${getHeader('One-Time Password (OTP)', 'Secure Login Verification', '#FF9800')}
    <div style="padding: 30px 25px; text-align: center;">
      ${getGreeting(data.name)}
      <p style="margin: 0 0 5px 0;">You requested to log in to your ${brandConfig.name} account using a one-time password for:</p>
      
      ${getAlertBox(`📧 Account Email: <strong>${escapeHtml(data.email)}</strong>`, 'info')}
      
      <div style="margin: 15px 0; padding: 10px; background-color: #f0f0f0; border-radius: 4px;">
        <strong>Account Type:</strong> ${data.role === 'admin' ? 'Administrator (Full Access)' : 'Regular User (View-Only)'}
      </div>
      
      <p style="margin: 20px 0 10px 0;">Use the OTP below to complete your login:</p>
      
      ${getCodeDisplay(data.code)}
      
      ${getAlertBox('⏰ This OTP will expire in 5 minutes from now', 'warning')}
      
      <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 8px; text-align: left;">
        <strong style="color: #ff9800;">💡 Security Tips:</strong>
        <ul style="margin: 10px 0 0 20px; color: #555;">
          <li>Never share this OTP with anyone</li>
          <li>${brandConfig.name} will never ask for your OTP via phone or email</li>
          <li>This OTP is only valid for the email: <strong>${escapeHtml(data.email)}</strong></li>
          <li>If you didn't request this login, please ignore this email</li>
        </ul>
      </div>
      
      <p style="margin: 20px 0 0 0; color: #666; font-size: 14px;">For your security, this OTP can only be used once and will expire after 5 minutes.</p>
      
      ${getButton('Login Now', `${brandConfig.websiteUrl}/login`)}
    </div>
    ${getFooter()}
  `),
  }),

  // OTP login for admin users (with additional security)
  otpLoginAdmin: (data) => ({
    subject: `🔐 ${data.code} - Admin OTP Verification for ${brandConfig.name}`,
    html: getBodyContainer(`
    ${getHeader('Admin OTP Verification', 'Secure Administrator Login', '#f44336')}
    <div style="padding: 30px 25px; text-align: center;">
      ${getGreeting(data.name)}
      <p style="margin: 0 0 5px 0;">You requested to log in to your ${brandConfig.name} administrator account using a one-time password for:</p>
      
      ${getAlertBox(`📧 Admin Email: <strong>${escapeHtml(data.email)}</strong>`, 'danger')}
      
      <div style="margin: 15px 0; padding: 10px; background-color: #f44336; color: white; border-radius: 4px;">
        <strong>⚠️ Administrator Account (Full System Access)</strong>
      </div>
      
      <p style="margin: 20px 0 10px 0;">Use the OTP below to complete your admin login:</p>
      
      ${getCodeDisplay(data.code)}
      
      ${getAlertBox('⏰ This OTP will expire in 5 minutes from now', 'warning')}
      
      <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 8px; text-align: left;">
        <strong style="color: #f44336;">🔒 Important Security Notice:</strong>
        <ul style="margin: 10px 0 0 20px; color: #555;">
          <li>Never share this OTP with anyone</li>
          <li>This is for administrator access with full system permissions</li>
          <li>If you didn't request this login, contact IT immediately</li>
          <li>This OTP is only valid for: <strong>${escapeHtml(data.email)}</strong></li>
        </ul>
      </div>
      
      <p style="margin: 20px 0 0 0; color: #666; font-size: 14px;">For your security, this OTP can only be used once and will expire after 5 minutes.</p>
      
      ${getButton('Access Admin Panel', `${brandConfig.websiteUrl}/admin/login`)}
    </div>
    ${getFooter()}
  `),
  }),

  emailVerificationCode: (data) => ({
    subject: `🔑 ${data.code} - Verify Your Email Address`,
    html: getBodyContainer(`
      ${getHeader('Email Verification', 'Confirm your email address', '#FF9800')}
      <div style="padding: 30px 25px; text-align: center;">
        ${getGreeting(data.name)}
        <p style="margin: 0 0 15px 0;">Please use the verification code below to verify your email address:</p>
        
        ${getCodeDisplay(data.code)}
        
        ${getAlertBox('⏰ This code will expire in 10 minutes', 'warning')}
        
        <p style="margin: 20px 0 0 0; color: #666;">If you didn't request this verification, please ignore this email.</p>
      </div>
      ${getFooter()}
    `),
  }),

  resetPassword: (data) => ({
    subject: `🔒 ${data.code} - Password Reset Code`,
    html: getBodyContainer(`
      ${getHeader('Password Reset Request', 'Secure password recovery', '#f44336')}
      <div style="padding: 30px 25px; text-align: center;">
        ${getGreeting(data.name)}
        <p style="margin: 0 0 5px 0;">We received a request to reset your password for:</p>
        <p style="margin: 0 0 20px 0; font-weight: bold;">${escapeHtml(data.email)}</p>
        
        <p>Use the code below to reset your password:</p>
        
        ${getCodeDisplay(data.code)}
        
        ${getAlertBox('⏰ This code will expire in 10 minutes', 'warning')}
        
        <p style="margin: 20px 0 0 0; color: #666;">If you didn't request this password reset, please ignore this email or contact support.</p>
      </div>
      ${getFooter()}
    `),
  }),

  courseAssignedTeacher: (data) => ({
    subject: `📚 New Course Assignment: ${data.courseName}`,
    html: getBodyContainer(`
      ${getHeader('New Course Assignment', 'You have been assigned a new course', '#4CAF50')}
      <div style="padding: 30px 25px;">
        ${getGreeting(data.teacherName)}
        <p style="margin: 0 0 15px 0;">You have been assigned to teach the following course:</p>
        
        ${getInfoTable([
      { label: 'Course Name', value: data.courseName },
      { label: 'Course Code', value: data.courseCode },
      { label: 'Schedule', value: data.schedule },
      { label: 'Semester', value: data.semester }
    ])}
        
        <div style="background-color: #e8f5e9; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <strong style="color: #2e7d32;">📌 Next Steps:</strong>
          <ul style="margin: 10px 0 0 20px; color: #555;">
            <li>Login to your teacher dashboard</li>
            <li>Review the course materials</li>
            <li>Access your student list</li>
            <li>Prepare your first lecture</li>
          </ul>
        </div>
        
        ${getButton('Go to Dashboard', `${brandConfig.websiteUrl}/teacher/dashboard`)}
      </div>
      ${getFooter()}
    `),
  }),

  courseAssignedStudent: (data) => ({
    subject: `✅ Course Registration Confirmed: ${data.courseName}`,
    html: getBodyContainer(`
      ${getHeader('Course Registration Confirmed!', 'You are now enrolled', '#2196F3')}
      <div style="padding: 30px 25px;">
        ${getGreeting(data.studentName)}
        <p style="margin: 0 0 15px 0;">Congratulations! You have been successfully registered for the following course:</p>
        
        ${getInfoTable([
      { label: 'Course Name', value: data.courseName },
      { label: 'Course Code', value: data.courseCode },
      { label: 'Instructor', value: data.instructor },
      { label: 'Schedule', value: data.schedule }
    ])}
        
        <div style="background-color: #e3f2fd; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <strong style="color: #1565c0;">🚀 Getting Started:</strong>
          <ul style="margin: 10px 0 0 20px; color: #555;">
            <li>Login to your student portal</li>
            <li>Access course materials and syllabus</li>
            <li>Join the course discussion forum</li>
            <li>Check assignment deadlines</li>
          </ul>
        </div>
        
        ${getButton('Access Course', `${brandConfig.websiteUrl}/student/courses`)}
        
        ${getAlertBox(`Questions? Contact your instructor at ${data.instructorEmail || brandConfig.supportEmail}`, 'info')}
      </div>
      ${getFooter()}
    `),
  }),

  otpLogin: (data) => ({
    subject: `🔑 ${data.code} - Your One-Time Password for ${brandConfig.name} Login`,
    html: getBodyContainer(`
      ${getHeader('One-Time Password (OTP)', 'Secure Login Verification', '#FF9800')}
      <div style="padding: 30px 25px; text-align: center;">
        ${getGreeting(data.name)}
        <p style="margin: 0 0 5px 0;">You requested to log in to your ${brandConfig.name} account using a one-time password for:</p>
        
        ${getAlertBox(`📧 Account Email: <strong>${escapeHtml(data.email)}</strong>`, 'info')}
        
        <p style="margin: 20px 0 10px 0;">Use the OTP below to complete your login:</p>
        
        ${getCodeDisplay(data.code)}
        
        ${getAlertBox('⏰ This OTP will expire in 5 minutes from now', 'warning')}
        
        <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 8px; text-align: left;">
          <strong style="color: #ff9800;">💡 Security Tips:</strong>
          <ul style="margin: 10px 0 0 20px; color: #555;">
            <li>Never share this OTP with anyone</li>
            <li>${brandConfig.name} will never ask for your OTP via phone or email</li>
            <li>This OTP is only valid for the email: <strong>${escapeHtml(data.email)}</strong></li>
            <li>If you didn't request this login, please ignore this email</li>
          </ul>
        </div>
        
        <p style="margin: 20px 0 0 0; color: #666; font-size: 14px;">For your security, this OTP can only be used once and will expire after 5 minutes.</p>
        
        ${getButton('Login Now', `${brandConfig.websiteUrl}/login`)}
      </div>
      ${getFooter()}
    `),
  }),
};

// Helper function to prevent XSS attacks
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}

export default templates;