const bcrypt = require('bcryptjs');

const hashes = [
  '$2a$10$g0FB.qTfqSV8hOlJ7EMyZe2XxUxirEGPZKQd2RgW9H8vvfVF41GFW', // admin
  '$2a$10$pEc45iY5LnMq/7dNfdL.8eMuYXCF5/hhxsjkzs2UrEWySKr/an00S', // john
  '$2a$10$/4IbIFmDIXY7MDdH.Mc2JufKkLYpQx1/s9ulyIKbjpIj3g/mgLBdm'  // guard
];

const passwords = ['admin123', 'password', '123456', 'resident', 'guard'];

(async () => {
  for (const [i, hash] of hashes.entries()) {
    for (const pwd of passwords) {
      const match = await bcrypt.compare(pwd, hash);
      if (match) {
        console.log(`User ${i+1} password: ${pwd}`);
        break;
      }
    }
  }
})();