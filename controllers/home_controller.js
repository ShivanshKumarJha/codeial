const Post = require('../models/post');

module.exports.home = async function (request, response){
    // Populate the user of each post
    try{
        const posts = await Post.find({}).populate('user').exec();
        return response.render('home',{
            title: 'Codeial | Home',
            posts: posts
        });
    }
    catch (err) {
        console.error(err);
        return;
    }
}

// module.exports.actionName=function(request,response){}