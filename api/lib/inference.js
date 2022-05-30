module.exports = function(app, UserSchema, RepoSchema, PopSchema, SimSchema, mongoose)
{    
    var fs = require('fs');
    var request = require('request')
    const fetch = require("node-fetch");

    // TODO: get urids from DB
    fs.readFile(__dirname + "/unique_repos.json", 'utf8', function (err, data) {
        let jsondata = JSON.parse(data);
        urids = jsondata.rids;
    });
    
    app.get('/inference/starred/repo/:username/:rid',function(req,res){
        let {username, current_repo} = req.params.username;
        async function run(){
            var Repos = await RepoSchema.find()
                .limit(50)
                .exec()
                .catch(err => res.status(400).json({ message: err.message }))
            res.json({"candidate_repos" : Repos});
        }
        run();
    });
}