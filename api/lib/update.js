module.exports = function(app, UserSchema, RepoSchema, mongoose)
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
    });

    app.get('/update/checkstarlist/:username/:starcount',function(req,res){
        let {username, starcount} = req.params;
        var result = {};
        // MONGODB -> SELECT (username, star_pages) into value (username, star_pages)
        const go = UserSchema.find()
            .where('login').in([username])
            .select('star_pages')
            .then((result) => {
                try{
                    num = result[0].star_pages;
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

    app.get('/update/fetchstarlist/:username/:starcount',function(req,res){
        let {username, starcount} = req.params;

        fetch(`https://api.github.com/users/${username}/starred`)
            .then((response) => response.json())
            .then((posts) => get_repo_ids(posts))
            .then((raw_list) => {
                console.log(raw_list);
                let filtered_list = raw_list.filter(x => urids.includes(x));
                console.log(filtered_list);
                return filtered_list
            })
            .then((repo_list) => {
                try {
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
}