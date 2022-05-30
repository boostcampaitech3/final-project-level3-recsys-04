module.exports = function(app, UserSchema, RepoSchema, mongoose)
{    
    var fs = require('fs');
    const fetch = require("node-fetch");

    var urids;
    var repo_list = [];
    
    function get_repo_ids(posts){
        repo_list = [];
        for (const i in posts){
            repo_list.push(posts[i].id);
        }
        return repo_list
    }

    // TODO: get urids from DB
    fs.readFile(__dirname + "/unique_repos.json", 'utf8', function (err, data) {
        let jsondata = JSON.parse(data);
        urids = jsondata.rids;
    });
    
    // TODO: GIVE CLICKED REPO ID TO MODEL API
    app.post('/clicked/repo',function(req,res){
        var result = {};
        
        // CHECK REQ VALIDITY
        if(!req.body["username"] || !req.body["repoId"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.status(400).json(result);
            return;
        }

        let {username, repoId} = req.body;
        console.log(username, repoId);

        if(urids.includes(repoId)){
            UserSchema.updateMany(
                {login:username},
                {$push:{"clicked":repoId}})
                .then((result) => {
                    console.log(result);                
                    res.sendStatus(200);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json({ message: err.message });
            })
        }else{
            res.status(200).json({ message: 'not in repo list'});
        }
    });
}
