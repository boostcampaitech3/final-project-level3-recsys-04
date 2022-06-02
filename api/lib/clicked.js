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
    
    app.get('/clicked/repo/:username/:repoId',function(req,res){
        var result = {};
        let username = req.params.username; 
        let repoId = req.params.repoId;
        repoId *= 1;
        
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
            res.status(200).json({ message: 'not in repo list' });
        }
    });
}
