const User = require('../models/user');

module.exports.profile = function(request,response){
    // return response.end('<h1>Users Profile</h1>');
    return response.render('user_profile',{
        title: 'User Profile'
    });
}

// Render the sign-up page
module.exports.signUp = function(request,response){
    return response.render('user_sign_up',{
        title:"Codeial | Sign Up"
    })
}

// Render the sign-in page
module.exports.signIn = function(request,response){
    return response.render('user_sign_in',{
        title:"Codeial | Sign In"
    })
}

// Get the sign-up data
module.exports.create = async function(request,response){
    if(request.body.password !== request.body.confirm_password){
        return response.redirect('back');
    }

    try{
        const user = await User.findOne({email:request.body.email});
        if(!user){
            return response.redirect('/users/sign-in');
        }
        else{
            // User already exists, redirect back
            return response.redirect('back');
        }
    }
    catch(err){
        console.error('Error:', err.message);
        // Handle the error appropriately, e.g., send an error response
        return response.status(500).send('Internal Server Error');
    }

}

// Get the sign in data and create a session
module.exports.createSession = function(request,response){
//    TODO
}