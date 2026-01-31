'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvitationEmail(email: string, inviteLink: string, companyName: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("⚠️ RESEND_API_KEY is missing. Email not sent.");
        return { success: false, error: "Configuration Error: Missing Email API Key" };
    }

    try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Humana <onboarding@resend.dev>';

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [email],
            subject: `You've been invited to join ${companyName} on Humana`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>You've been invited!</h1>
                    <p>You have been invited to join <strong>${companyName}</strong> using Humana - the modern HR platform.</p>
                    <p>Click the link below to accept your invitation and set up your account:</p>
                    <a href="${inviteLink}" style="display: inline-block; background-color: #0C212F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 16px 0;">Accept Invitation</a>
                    <p style="color: #666; font-size: 14px;">Or copy this link: <br>${inviteLink}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                    <p style="color: #999; font-size: 12px;">© 2026 Humana Inc.</p>
                </div>
            `,
        });

        if (error) {
            console.error("Resend Error:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error: any) {
        console.error("Email Sending Failed:", error);
        return { success: false, error: error.message };
    }
}
