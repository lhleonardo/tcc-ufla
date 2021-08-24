interface MailDriver {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      name: 'Leonardo | Equipe GoBarber',
      email: 'admin@leonardobraz.xyz',
    },
  },
} as MailDriver;
