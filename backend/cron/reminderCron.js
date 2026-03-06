const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Order = require('../models/Order');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendReminderEmail = async (email, eventType) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Special Day is Coming 🎉',
        text: `Last year you celebrated ${eventType} with a cake from Bakock. Celebrate again this year with a fresh cake from us!`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${email}`);
    } catch (error) {
        console.error(`Email error: ${error}`);
    }
};

const setupReminderCron = () => {
    // Run every day at 10:00 AM
    cron.schedule('0 10 * * *', async () => {
        console.log('Running daily reminder cron job...');
        const today = new Date();
        const orders = await Order.find({
            eventDate: { $exists: true },
            eventType: { $ne: 'None' },
        }).populate('userId', 'email');

        orders.forEach((order) => {
            const eventDate = new Date(order.eventDate);
            if (
                eventDate.getDate() === today.getDate() &&
                eventDate.getMonth() === today.getMonth() &&
                eventDate.getFullYear() < today.getFullYear()
            ) {
                sendReminderEmail(order.userId.email, order.eventType);
            }
        });
    });
};

module.exports = setupReminderCron;
