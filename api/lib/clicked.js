module.exports = function(app, conn)
{    
    var fs = require('fs');
    var url = require('url');
    
    // TODO: GIVE CLICKED REPO ID TO MODEL API
    app.post('/clicked/repo',function(req,res){
        var result = {  };
        
        // CHECK REQ VALIDITY
        if(!req.body["username"] || !req.body["repoId"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }
        result["success"] = 1;
        res.json(result);
    });
}
