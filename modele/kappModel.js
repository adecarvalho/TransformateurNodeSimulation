class KappModel {

    constructor() {

        this.parametres={
            m:1.0,
            rp :900,
            lp : 1.5,
            rs : 0.5,
            xs : 0.5,
        }
        //
        this.reglages={
            u1eff:0,
            module:500,
            phase:0,
        }
        //
        this.grandeurs={
            i1eff:0,
            i2eff:0,
            u2eff:0,
            p1:0,
            p2:0,
        }
    }
    //
    afficheParametres(){
        let str=` Les parametres:
        m= ${this.parametres.m}
        Rp= ${this.parametres.rp}
        Lp= ${this.parametres.lp}
        Rs= ${this.parametres.rs}
        Xs= ${this.parametres.xs}`

        console.log(str)
    }
    //
    setReglages(les_reglages) {
        this.reglages=les_reglages
    }
    //
    setParametres(m,rp,lp,rs,xs) {
        this.parametres.m=m
        this.parametres.rp=rp
        this.parametres.lp=lp
        this.parametres.rs=rs
        this.parametres.xs=xs
    }
    //
    getParametres(){
        return this.parametres
    }
    //
    process(cb){
        //
        var phi=Math.PI*(this.reglages.phase/180.0)

        var rel=(this.parametres.rs+this.reglages.module*Math.cos(phi))
        rel=Math.pow(rel,2)

        var img=(this.parametres.xs+this.reglages.module*Math.sin(phi))
        img=Math.pow(img,2)

        var courant=(this.parametres.m*this.reglages.u1eff)/Math.sqrt(rel+img)

        this.grandeurs.i2eff=courant
        //
        this.grandeurs.u2eff=this.reglages.module*courant

        //puissance p2
        this.grandeurs.p2=this.grandeurs.i2eff*this.grandeurs.u2eff*Math.cos(phi)

        //courant I1eff
        rel=(this.parametres.m*this.grandeurs.i2eff)+(this.reglages.u1eff/this.parametres.rp)
        rel=Math.pow(rel,2)

        img=this.reglages.u1eff/(100*Math.PI*this.parametres.lp)
        img=Math.pow(img,2)

        courant=Math.sqrt(rel+img)
        this.grandeurs.i1eff=courant

        //puissance p1
        var fer=(this.reglages.u1eff*this.reglages.u1eff)/this.parametres.rp
        var joul=this.parametres.rs*this.grandeurs.i2eff*this.grandeurs.i2eff

        this.grandeurs.p1=this.grandeurs.p2+fer+joul

        //
        cb(this.grandeurs)
    }
}
//
module.exports=KappModel
