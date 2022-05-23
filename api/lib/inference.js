module.exports = function(app, conn)
{    
    var fs = require('fs');
    var request = require('request')
    const fetch = require("node-fetch");

    var repo_list = [];
    
    function get_repo_ids(posts){
        for (const i in posts){
            repo_list.push(posts[i].id);
        }
        return repo_list
    }

    app.get('/inference/starred/repo/:username',function(req,res){
        let username = req.params.username;

        // 1. get starred repos from DB, user table
        /*
        conn.query('SELECT star_list from Users in' + username, function (err, result) {
            if (err) {
              console.log(err);
            }else {
              repos["rids"] = result
              const user_starred_repos = repos;
            //   res.send(repos);
            }
        })
        */
        const user_starred_repos = {"rids" : [ 224122584, 328381312, 280577559, 146024443 ]};
        // 2. give starred repos to model and get candidates from model (new api would be better)
        /*
        request('{api}/model', function(error, response, body){
            if(error){
            console.log(error)
            }
            var obj = JSON.parse(body)
            console.log(obj) // 콘솔창에 찍어보기
        */
        fetch(`https://api.github.com/users/${username}/starred`)
            .then((response) => response.json())
            .then((posts) => res.send(posts)) // TODO: filter and insert user table, repo_user table
            .catch((error) => console.log("error:", error));

        // res.send(candidate_repos);
    });

    app.post('/inference/starred/repo/:username',function(req,res){
        let username = req.params;
        let candidates = req.body["candidate_repos"]        
        
                
    });    
}