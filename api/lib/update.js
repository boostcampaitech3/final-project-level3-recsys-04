module.exports = function(app, conn)
{    
    var fs = require('fs');
    var url = require('url');
    const fetch = require("node-fetch");
    var result = {};
    var repo_list = [];
    
    function get_repo_ids(posts){
        for (const i in posts){
            repo_list.push(posts[i].id);
        }
        return repo_list
    }
    // TODO: COMPARE WITH MONGO DB
    function compare_repo_ids(repo_list){
        return 0
    }


    app.get('/update/fetch/list/:username/:starcount',function(req,res){
        let {username, starcount} = req.params;
        result["username"] = username

        fetch(`https://api.github.com/users/${username}/starred`)
            .then((response) => response.json())
            .then((posts) => get_repo_ids(posts))
            .then((repo_list) => compare_repo_ids(repo_list))
            .then((need_fetch) => {
                result["need_fetch"] = need_fetch; 
                res.json(result);
            })
            .catch((error) => console.log("error:", error));
    });

    app.get('/update/starred/list/:username/:repo_id',function(req,res){
        let {username, repo_id} = req.params;
        /*
        MONGODB -> INSERT (username, repo_id) into value (username, repo_id)
        */
       res.send("Updated");
    });

    app.get('/update/starred/repo/:username/:repo_id',function(req,res){
        let {username, repo_id} = req.params;
        /*
        MONGODB -> INSERT (username, repo_id) into value (username, repo_id)
        */
        res.send("Updated");
    });
}