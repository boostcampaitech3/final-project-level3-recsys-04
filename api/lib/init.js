module.exports = function(app)
{    
    var fs = require('fs');
    var url = require('url');
    
    app.get('/users/:username',function(req,res){
        let {username} = req.params;
        // read file from chrome extension
        fs.readFile(`/api/users/${username}`, 'utf8', function(err, description){
            const obj = JSON.parse(description);
            var arr= [];
            arr.push(obj.login);
            arr.push(obj.id);            
            res.end(arr);
          });
    });

    app.get('/users/:username/starred',function(req,res){
        let {username} = req.params;
        fs.readFile(`/api/users/${username}/starred`, 'utf8', function(err, description){
            res.end(description.length);
          });
    });
}