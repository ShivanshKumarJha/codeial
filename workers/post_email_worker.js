const queue = require('../config/kue');

const postsMailer = require('../mailers/posts_mailer');

queue.process('emails', function(job, done) {
  // console.log('emails worker is processing the job', job.data);
  postsMailer.newPost(job.data);
  done();
});