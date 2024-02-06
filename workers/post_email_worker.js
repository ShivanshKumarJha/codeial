const queue = require('../config/kue');

const postsMailer = require('../mailers/posts_mailer');

queue.process('new-post', function(job, done) {
  // console.log('emails worker is processing the job in post worker', job.data);
  postsMailer.newPost(job.data);
  done();
});

queue.process('user-emails', function(job, done) {
  // console.log('emails worker is processing the job in post worker', job.data);
  postsMailer.resetPassword(job.data);
  done();
});

queue.process('signup-successful', function(job, done) {
  // console.log('User email worker is processing a job (Sign-up) in post worker', job.data);
  postsMailer.signupSuccess(job.data);
  done();
});