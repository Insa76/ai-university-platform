const express = require('express');
const messageQueue = require('../../shared/libs/message-queue');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

// Transporte de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Consumir notificaciones de la cola
messageQueue.consume('notifications', async (notification) => {
  try {
    console.log('📧 Processing notification:', notification);
    
    const { type, userId, email, subject, message, data } = notification;
    
    switch (type) {
      case 'welcome':
        await sendWelcomeEmail(email, data);
        break;
      case 'course_enrollment':
        await sendCourseEnrollmentEmail(email, data);
        break;
      case 'assessment_result':
        await sendAssessmentResultEmail(email, data);
        break;
      case 'progress_update':
        await sendProgressUpdateEmail(email, data);
        break;
      default:
        console.log(`⚠️ Unknown notification type: ${type}`);
    }
    
    console.log(`✅ Notification sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    throw error; // Para requeue
  }
});

// Funciones de envío de emails
async function sendWelcomeEmail(email, data) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: '¡Bienvenido a AI University!',
    html: `
      <h1>¡Bienvenido a AI University!</h1>
      <p>Hola ${data.name},</p>
      <p>Gracias por unirte a nuestra plataforma de educación basada en IA.</p>
      <p>Tu cuenta ha sido creada exitosamente.</p>
      <a href="${process.env.FRONTEND_URL}/login" 
         style="background: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Comenzar a aprender
      </a>
    `
  };
  
  return await transporter.sendMail(mailOptions);
}

async function sendCourseEnrollmentEmail(email, data) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: `Inscripción confirmada: ${data.courseTitle}`,
    html: `
      <h1>Inscripción Confirmada</h1>
      <p>Hola,</p>
      <p>Te has inscrito exitosamente en el curso: <strong>${data.courseTitle}</strong></p>
      <p>Fecha de inscripción: ${new Date().toLocaleDateString()}</p>
      <a href="${process.env.FRONTEND_URL}/courses/${data.courseId}" 
         style="background: #10B981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Ir al curso
      </a>
    `
  };
  
  return await transporter.sendMail(mailOptions);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Notification Service',
    connected: messageQueue.isConnected,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`📧 Notification Service running on port ${PORT}`);
});

// Manejo de cierre limpio
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down Notification Service...');
  if (messageQueue.connection) {
    await messageQueue.connection.close();
  }
  process.exit(0);
});