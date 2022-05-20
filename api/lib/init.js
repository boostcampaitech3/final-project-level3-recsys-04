module.exports = function(app, conn)
{    
    var fs = require('fs');
    var url = require('url');
    const fetch = require("node-fetch");

    var result = {};
    var repo_list = [];
    
    function get_repo_list(posts){
        for (const i in posts){
            repo_list.push(posts[i].id);
        }
        return repo_list
    }

    /*
    function insert_repo_list(repo_list, conn){
        conn.query('INSERT INTO user (login, star_page, star_list) VALUE(username, repo_list, repo_list.length)', 
                    function (err, result) {
            if (err) {
              console.log(err);
            }else {
              repos["rids"] = result
              const user_starred_repos = repos;
            //   res.send(repos);
            }
        })
    } 
    */ 

    app.get('/init/:username/:starcount',function(req,res){
        let {username, starcount} = req.params;
        result["username"] = username

        fetch(`https://api.github.com/users/${username}/starred`)
            .then((response) => response.json())
            .then((posts) => get_repo_list(posts))
            .then((repo_lists) => res.send(repo_lists)) // TODO: filter and insert user table, repo_user table
            .catch((error) => console.log("error:", error));
    });
}