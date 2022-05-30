module.exports = function(app, UserSchema, RepoSchema, mongoose)
{    
    const fs = require('fs');
    const fetch = require("node-fetch");

    var uid;
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
    
    app.get('/init/:username/:starcount',function(req,res){
        let {username, starcount} = req.params;

        fetch(`https://api.github.com/users/${username}`)
            .then((response) => response.json())
            .then((data) => {
                uid = data.id;
                console.log(uid);
                return fetch(`https://api.github.com/users/${username}/starred`);
            })        
            .then((response) => response.json())
            .then((posts) => {
                const repo_lists = get_repo_ids(posts);
                console.log(repo_lists);
                // TODO: get urids from DB
                let filtered_lists = repo_lists.filter(x => urids.includes(x));
                const InitUser = new UserSchema({
                    uid: uid,
                    login: username,
                    star_pages: starcount,
                    star_in_item: filtered_lists // repo_lists 
                });
                try {
                    InitUser.save();
                    res.sendStatus(200);
                  } catch (err) {
                    res.status(400).json({ message: err.message });
                };
            })
            .catch((err) => {
                console.log("error:", err);
                res.status(400).json({ message: err.message })
            });
    });
}