module.exports = function(app, conn)
{    
    var fs = require('fs');
    var url = require('url');

    app.get('{api}/fetch/starred/list/:username/:starcount',function(req,res){
        let {username, starcount} = req.params;
        fetch(`https://api.github.com/users/${username}/starred`)
            .then((response) => response.json())
            .then((posts) => console.log(posts.length)) // TODO: check whether to update 
            .catch((error) => console.log("error:", error));
    });
}