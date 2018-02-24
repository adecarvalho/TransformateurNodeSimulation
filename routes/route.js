//home
exports.home=(req,res)=>{
    res.render('home',{
        titre:"Transformateur"
    })
}

//Kapp
exports.kapp=(req,res)=>{
    res.render('kapp',{
        titre:"Model de Kapp"
    })
}

exports.editionKapp=(req,res)=>{
    console.log(req.body)
    res.redirect('/charge')
}

//notfound
exports.notfound=(req,res)=>{
    res.render('notfound',{
        titre:"Page not found"
    })
}
