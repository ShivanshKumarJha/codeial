const User = require('../models/user');

module.exports.profile = function(request,response){
    // return response.end('<h1>Users Profile</h1>');
    return response.render('user_profile',{
        title: 'User Profile'
    });
}

// Render the sign-up page
module.exports.signUp = function(request,response){
    if(request.isAuthenticated()){
        return response.redirect('/users/profile');
    }
    return response.render('user_sign_up',{
        title: "Codeial | Sign Up"
    })
}

// Render the sign-in page
module.exports.signIn = function(request,response){
    if(request.isAuthenticated()){
        return response.redirect('/users/profile');
    }
    return response.render('user_sign_in',{
        title: "Codeial | Sign In"
    })
}

// Get the sign-up data
module.exports.create = async function (request, response){
    try{
        if(request.body.password !== request.body.confirm_password){
            return response.redirect('back');
        }

        const existingUser = await User.findOne({ email: request.body.email });

        if(!existingUser){
            const newUser = await User.create(request.body);
            return response.redirect('/users/sign-in');
        }
        else return response.redirect('back');
    }
    catch(error){
        console.error('Error in signing up:', error);
        return response.status(500).send('Internal server error');
    }
};

// Get the sign in data and create a session
module.exports.createSession = function(request,response){
    return response.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout(function(err) {
        if(err){
            // Handle any errors that occur during logout
            console.error(err);
        }
        return res.redirect('/');
    });
}