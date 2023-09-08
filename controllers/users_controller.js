module.exports.profile = function(request,response){
    // return response.end('<h1>Users Profile</h1>');
    return response.render('user_profile',{
        title: 'User Profile'
    });
}

// Render the sign up page
module.exports.signUp = function(request,response){
    return response.render('user_sign_up',{
        title:"Codeial | Sign Up"
    })
}

// Render the sign in page
module.exports.signIn = function(request,response){
    return response.render('user_sign_in',{
        title:"Codeial | Sign In"
    })
}