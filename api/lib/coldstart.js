app.post('/addUser/:username', function(req, res){

    var result = {  };
    var username = req.params.username;

    // CHECK REQ VALIDITY
    if(!req.body["password"] || !req.body["name"]){
        result["success"] = 0;
        result["error"] = "invalid request";
        res.json(result);
        return;
    }

    // LOAD DATA & CHECK DUPLICATION
    fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
        var users = JSON.parse(data);
        if(users[username]){
            // DUPLICATION FOUND
            result["success"] = 0;
            result["error"] = "duplicate";
            res.json(result);
            return;
        }

        // ADD TO DATA
        users[username] = req.body;

        // SAVE DATA
        fs.writeFile(__dirname + "/../data/user.json",
                     JSON.stringify(users, null, '\t'), "utf8", function(err, data){
            result = {"success": 1};
            res.json(result);
        })
    })
});