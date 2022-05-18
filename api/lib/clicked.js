module.exports = function(app)
{    
    var fs = require('fs');
    var url = require('url');
    
    app.post('/clicked/:repo',function(req,res){
        var result = {  };
        var repo = req.params.repo;

        // CHECK REQ VALIDITY
        if(!req.body["repoId"] || !req.body["username"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA & CHECK DUPLICATION
        fs.readFile( __dirname + "/data/repo.json", 'utf8',  function(err, data){
            var repos = JSON.parse(data);
            if(repos[repo].includes(req.body["username"])){
                // DUPLICATION FOUND   ~~~> should we send error code?
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            // ADD TO DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/data/repo.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
    });
}