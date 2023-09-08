module.exports.home = function (request, response) {
    // Adding cookie - in Application Updating cookie - here
    // console.log(request.cookies);
    // response.cookie('user_id',25);

    // return response.end('<h1> Express is up for Codeial!</h1>');
    return response.render('home',{
        title: 'Home'
    });
}

// module.exports.actionName=function(request,response){}