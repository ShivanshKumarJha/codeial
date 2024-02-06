const queue = require('../config/kue');

const commentsMailer = require('../mailers/comments_mailer');

queue.process('emails', function(job, done) {
  // console.log('emails worker is processing the job in comments worker', job.data);
  commentsMailer.newComment(job.data);
  done();
});