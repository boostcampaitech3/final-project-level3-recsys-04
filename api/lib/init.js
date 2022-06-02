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

    fs.readFile(__dirname + "/unique_repos.json", 'utf8', function (err, data) {
        let jsondata = JSON.parse(data);
        urids = jsondata.rids;
    });
    
    app.get('/init/:username',function(req,res){
        let username = req.params.username;

        fetch(`https://api.github.com/users/${username}`)
            .then((response) => response.json())
            .then((data) => {
                uid = data.id;
                console.log(uid);
                return fetch(`https://api.github.com/users/${username}/starred`);
            })        
            .then((response) => response.json())
            .then((posts) => {
                let starcount = posts.length;
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
    
    app.get('/init/indevelop/:username',function(req,res){
        let username = req.params.username;
        var starcount;
        var rid;
        const headers = new fetch.Headers({
            'Authorization': `token ${my_token}`
        });

        fetch(`https://api.github.com/users/${username}`, headers)
            .then((response) => response.json())
            .then((data) => {
                uid = data.id;
                console.log(uid);
                return fetch(`https://api.github.com/users/${username}/starred?per_page=1`, headers);
            })        
            .then((response) => {
                let A = [...response.headers];
                const re = /(\d+)>; rel="last"/g;
                for(var i in A){
                    if (A[i].includes('link')){
                        let pageindex = A[i][1].match(re);
                        starcount = parseInt(pageindex, 10);
                    }
                }
            })
            .then(() => {
                var repo_lists = [];
                console.log(starcount);
                async function run(){
                    for (let i=1; i<starcount/100 + 1; i++){
                        await fetch(`https://api.github.com/users/${username}/starred?per_page=100&page=${i}`, headers)
                            .then((response) => response.json())
                            .then((posts) => {
                                let repo_list = get_repo_ids(posts);
                                Array.prototype.push.apply(repo_lists, repo_list);
                            })
                            .catch((err) => {
                                console.log("error:", err);
                                res.status(400).json({ message: err.message })
                            });
                    }
                    console.log(repo_lists);
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
                }
                run();          
            })
            .catch((err) => {
                console.log("error:", err);
                res.status(400).json({ message: err.message })
            });
    });
}