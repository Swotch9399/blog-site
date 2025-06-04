export const SUPABASE_CONFIG_GUIDE = {

  SITE_URL: {
    development: "http://localhost:3000",
    production: "https://yourdomain.com", // Gerçek domain'inizi buraya yazın
  },

  REDIRECT_URLS: [
    "http://localhost:3000/auth/verify",
    "http://localhost:3000/auth/reset-password",
    "https://yourdomain.com/auth/verify", // Production URL
    "https://yourdomain.com/auth/reset-password", // Production URL
  ],

  EMAIL_TEMPLATES: {
    confirm: {
      subject: "Blog - Email Adresinizi Onaylayın",
      body: `
        <h2>Blog'a Hoş Geldiniz!</h2>
        <p>Hesabınızı aktifleştirmek için aşağıdaki linke tıklayın:</p>
        <a href="{{ .ConfirmationURL }}">Email Adresimi Onayla</a>
        <p>Bu link 24 saat geçerlidir.</p>
      `,
    },
    recovery: {
      subject: "Blog - Şifre Sıfırlama",
      body: `
        <h2>Şifre Sıfırlama Talebi</h2>
        <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
        <a href="{{ .ConfirmationURL }}">Şifremi Sıfırla</a>
        <p>Bu link 1 saat geçerlidir.</p>
      `,
    },
  },
}
