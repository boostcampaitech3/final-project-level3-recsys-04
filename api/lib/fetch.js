module.exports = function(app)
{    
    var fs = require('fs');
    var url = require('url');

    app.get('/fetch/starred/list/:username/starred',function(req,res){
        let {username} = req.params;
        // read file from chrome extension
        fs.readFile(`/api/users/${username}/starred`, 'utf8', function(err, description){
            const obj = JSON.parse(description);
            var arr= [];
            arr.push(obj.name);
            arr.push(obj.id);            
            res.end(arr);
          });
    });
}