module.exports = function(app, conn)
{    
    var fs = require('fs');
    var url = require('url');

    app.get('{api}/update/starred/list/:username/:starcount',function(req,res){
        let {username, starcount} = req.params;
        // read file from chrome extension
        fs.readFile(`/api/update/starred/list/${username}/${starcount}`, 'utf8', function(err, description){
            const obj = JSON.parse(description);
            var arr= [];
            arr.push(obj.name);
            arr.push(obj.id);            
            res.end(arr);
          });
    });
}