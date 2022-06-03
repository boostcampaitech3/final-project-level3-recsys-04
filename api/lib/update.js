module.exports = function(app, UserSchema, RepoSchema, mongoose, my_token)
{    
    var fs = require('fs');
    var url = require('url');
    const fetch = require("node-fetch");
    var result = {};
    var repo_list = [];
    var urids;
    
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

    app.get('/update/starred/repo/:username/:repo_id',function(req,res){
        let {username, repo_id} = req.params;
        // MONGODB -> INSERT (username, repo_id, starcount) into value (username, repo_id, starcount)
        repo_id *= 1;

        if(urids.includes(repo_id)){
            UserSchema.updateMany(
                {login:username},
                {$push:{"star_in_item":repo_id}})
                .then((result) => {
                    console.log(result);                
                    res.sendStatus(200);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json({ message: err.message });
                })
        }else{
            res.send("not in repo list");
        }

    });

    app.get('/update/checkstarlist/:username',function(req,res){
        let username = req.params.username;
        var starcount;
        var result = {};
        // MONGODB -> SELECT (username, star_pages) into value (username, star_pages)
        fetch(`https://api.github.com/users/${username}/starred`)
            .then((response) => response.json())
            .then((posts) => starcount = posts.length)
            .then(() => UserSchema.find()
                .where('login').in([username])
                .select('star_pages'))
            .then((result) => {
                try{
                    var num = result[0].star_pages;
                } catch (err) {
                    res.status(400).json({ message: err.message });
                }
                return num
            })
            .then((num) => {
                if(num==starcount){
                    result["needFetch"] = "False";
                }else { result["needFetch"] = "True";}
                res.json(result);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json({ message: err.message });
            })
    });

    app.get('/update/fetchstarlist/:username',function(req,res){
        let username = req.params.username;
        var starcount;

        fetch(`https://api.github.com/users/${username}/starred`)
            .then((response) => response.json())
            .then((posts) => {
                starcount = posts.length;
                return get_repo_ids(posts);
            })
            .then((raw_list) => {
                console.log(raw_list);
                let filtered_list = raw_list.filter(x => urids.includes(x));
                console.log(filtered_list);
                return filtered_list
            })
            .then((repo_list) => {
                try {
                    console.log(starcount);
                    UserSchema.updateMany({login:username}, 
                        {$set:{ star_in_item:repo_list, star_pages:starcount }})
                      .then((result) => console.log(result))
                    res.sendStatus(200);
                } catch (err) { res.status(400).json({ message: err.message }) };
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json({ message: err.message });
            })
    });

    app.get('/update/checkstarlist/indevelop/:username',function(req,res){
        let username = req.params.username;
        var starcount;
        var result = {};
        // MONGODB -> SELECT (username, star_pages) into value (username, star_pages)
        fetch(`https://api.github.com/users/${username}/starred?per_page=1`, headers)
            .then((response) => {
                let A = [...response.headers];
                const re = /(\d)>; rel="last"/g;
                for(var i in A){
                    if (A[i].includes('link')){
                        let pageindex = A[i][1].match(re);
                        starcount = parseInt(pageindex, 10);
                    }
                }
            })
            .then(() => UserSchema.find()
                .where('login').in([username])
                .select('star_pages'))
            .then((result) => {
                try{
                    var num = result[0].star_pages;
                } catch (err) {
                    res.status(400).json({ message: err.message });
                }
                return num
            })
            .then((num) => {
                console.log('num',num,'starcount',starcount);
                if(num==starcount){
                    result["needFetch"] = "False";
                }else { result["needFetch"] = "True";}
                res.json(result);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json({ message: err.message });
            })
    });

    app.get('/update/fetchstarlist/indevelop/:username',function(req,res){
        let username = req.params.username;
        var starcount;

        fetch(`https://api.github.com/users/${username}`, headers)
            .then((response) => response.json())
            .then((data) => {
                uid = data.id;
                console.log(uid);
                return fetch(`https://api.github.com/users/${username}/starred?per_page=1`, headers);
            })        
            .then((response) => {
                let A = [...response.headers];
                const re = /(\d)>; rel="last"/g;
                for(var i in A){
                    if (A[i].includes('link')){
                        let pageindex = A[i][1].match(re);
                        starcount = parseInt(pageindex, 10);
                        
                    }
                }
            })
            .then(() => {
                var repo_lists = [];
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
                    try {
                        console.log(starcount);
                        UserSchema.updateMany({login:username}, 
                            {$set:{ star_in_item:filtered_lists, star_pages:starcount }})
                          .then((result) => console.log(result))
                        res.sendStatus(200);
                    } catch (err) { res.status(400).json({ message: err.message }) };
                }
                run();          
            })
            .catch((err) => {
                console.log("error:", err);
                res.status(400).json({ message: err.message })
            });
    });
}