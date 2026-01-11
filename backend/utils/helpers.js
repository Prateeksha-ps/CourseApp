// Generate a random 5-digit student ID
exports.generateStudentId = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// Simple validation middleware
exports.validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path[0],
        message: err.message.replace(/\"/g, "'")
      }));
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    next();
  };
};

// Simple error handler
exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Simple authentication middleware
exports.authenticate = (req, res, next) => {
  // This is a simplified version - in a real app, you'd use JWT or sessions
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  // For admin, we'll use Basic Auth with username:admin, password:admin
  if (authHeader.startsWith('Basic ')) {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    
    if (username === 'admin' && password === 'admin') {
      req.user = { id: 'admin', role: 'admin' };
      return next();
    }
  }
  
  // For students, we'll use a simple token (studentId:email in base64)
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const credentials = Buffer.from(token, 'base64').toString('ascii');
    const [studentId, email] = credentials.split(':');
    
    if (studentId && email) {
      req.user = { id: studentId, email, role: 'student' };
      return next();
    }
  }
  
  return res.status(401).json({ message: 'Invalid authentication credentials' });
};

// Role-based access control
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }
    
    next();
  };
};
