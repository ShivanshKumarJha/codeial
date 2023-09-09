const User = require('../models/user');

module.exports.profile = async function(request, response){
    try{
        if(request.cookies.user_id){
            const user = await User.findById(request.cookies.user_id).exec();
            if(user){
                return response.render('user_profile',{
                    title:"User Profile",
                    user:user
                });
            }
            else{
                return response.redirect('/users/sign-in');
            }
        }
        else{
            return response.redirect('/users/sign-in');
        }
    }
    catch(err){
        // Handle any potential errors here
        console.error(err);
        return response.status(500).send('Internal Server Error');
    }
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

module.exports.createSession = async function(request,response){
    try{
        // Use async/await to find the user by email
        const user = await User.findOne({email:request.body.email});
        if(!user){
            // Handle user not found
            return response.redirect('back');
        }

        // Handle password which doesn't match
        if(user.password !== request.body.password){
            return response.redirect('back');
        }

        // Handle session creation
        response.cookie('user_id',user.id);
        return response.redirect('/users/profile');
    }
    catch(err){
        console.error('Error in finding user in signing in',err);
        return response.status(500).send('Internal Server Error'); // Handle the error appropriately
    }
};