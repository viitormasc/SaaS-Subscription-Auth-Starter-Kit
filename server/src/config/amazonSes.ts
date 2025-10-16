import AWS from 'aws-sdk';
const ses = new AWS.SES({ region: 'us-east-1' });

const params = {
  Destination: {
    ToAddresses: ['vittor_99@hotmail.com'],
  },
  Message: {
    Body: {
      Text: { Data: 'Hello from AWS SES!' },
    },
    Subject: { Data: 'Test Email' },
  },
  Source: 'sender@verified-domain.com',
};

ses.sendEmail(params, (err: any, data: any) => {
  if (err) console.log(err);
  else console.log('Email sent:', data);
});
