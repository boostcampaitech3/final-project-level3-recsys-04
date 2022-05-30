module.exports = function(app, UserSchema, RepoSchema, PopSchema, conn)
{
    app.get('/coldstart', function(req, res){
        results = {}
        async function run(){
            var Repos1 = await RepoSchema.find()
                .limit(5)
                .exec()
                .catch(err => res.status(400).json({ message: err.message }))
            results["category_m1"] = Repos1;
            var Repos2 = await RepoSchema.find()
                .limit(5)
                .exec()
                .catch(err => res.status(400).json({ message: err.message }))
            results["category_m2"] = Repos2;
            var Repos3 = await RepoSchema.find()
                .limit(5)
                .exec()
                .catch(err => res.status(400).json({ message: err.message }))
            results["category_m3"] = Repos3;
            var Repos4 = await RepoSchema.find()
                .limit(5)
                .exec()
                .catch(err => res.status(400).json({ message: err.message }))
            results["category_m4"] = Repos4;
            var Repos5 = await RepoSchema.find()
                .limit(5)
                .exec()
                .catch(err => res.status(400).json({ message: err.message }))
            results["category_m5"] = Repos5;
            var Repos6 = await RepoSchema.find()
                .limit(5)
                .exec()
                .catch(err => res.status(400).json({ message: err.message }))
            results["category_m6"] = Repos6;
            res.json(results);
        }
        run();
    });
}