module.exports = function(app, UserSchema, RepoSchema, PopSchema, SimSchema, mongoose)
{    
    var fs = require('fs');
    var request = require('request');

    // TODO: get urids from DB
    fs.readFile(__dirname + "/unique_repos.json", 'utf8', function (err, data) {
        let jsondata = JSON.parse(data);
        urids = jsondata.rids;
    });
    
    app.get('/inference/starred/repo/:username/:rid',function(req,res){
        let username = req.params.username;
        let current_repo = req.params.rid;
        current_repo *= 1;
        var cf_rids = [];
        var sim_graph_rids = [];
        var sim_doc_rids = [];
        async function run(){
            // 1. get starred repos from DB, user table
            var data = await UserSchema.find()
                .where('login').in([username])
                .select('star_in_item clicked')
                .exec()
                .catch(err => res.status(400).json({ message: err.message }))
            let user_starred_repos = data[0].star_in_item;
            let user_clicked_repos = data[0].clicked;
            let user_repos = [...new Set([...user_starred_repos, ...user_clicked_repos])]; 
            console.log(user_repos.length);

            // 2. give starred repos & current repo to model and get candidates from model
            // SimSchema --> Similarity graph_sim, doc_sim, code_sim
            if (urids.includes(current_repo)) {
                let sim_rids = await SimSchema.find()
                    .where('rid').equals(current_repo)
                    .exec()
                sim_graph_rids = sim_rids[0].graph_sim;
                sim_doc_rids = sim_rids[0].doc_sim;
            }
            // Cf Model (RecVAE)
            if (user_repos > 4){
                function getBody(){
                    return new Promise(function (resolve, reject){
                        const options = {
                            uri:'http://localhost:30001/model',  //  http://0.0.0.0:8090/model
                            method: 'POST',
                            body: {
                            'rids': user_repos
                            },
                            json: true
                        }
                        request.post(options, function(error, response, body){            
                            if(error){
                                console.log(error);
                                reject(error);
                                res.status(400).json({ message: error.message })
                            }else{
                                resolve(body.rids);
                            }
                        })
                    })
                }
                cf_rids = await getBody();
            }
            // Popularity based
            var pop_repos = await RepoSchema.find()
                .sort('-stars')
                .limit(10)
                .exec()
                .catch(err => res.status(400).json({ message: err.message }))

            // 3. filter and send response
            let sim_cf_rids = [...new Set([...cf_rids, ...sim_graph_rids, ...sim_doc_rids])];
            // RepoSchema --> get Repo object
            let sim_cf_repos = await RepoSchema.find()
                .where('rid').in(sim_cf_rids)
                .exec()
                .catch(err => res.status(400).json({ message: err.message }))
            
            Array.prototype.push.apply(sim_cf_repos, pop_repos);
            let candidate_repos = sim_cf_repos;
            res.json({"candidate_repos" : candidate_repos});
        }
        run();
    });
}