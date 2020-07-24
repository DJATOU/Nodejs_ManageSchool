function Tuteur (nom, prenom, numeroTel, mail){
    this.nom = nom;
    this.prenom = prenom;
    this.numeroTel = numeroTel;
    this.mail = mail;
}

Tuteur.prototype.getNom = function(){ return this.nom;}
Tuteur.prototype.getPrenom = function(){ return this.prenom;}
Tuteur.prototype.getnumeroTel = function() { return this.numeroTel;}
Tuteur.prototype.getMail = function() { return this.mail;}

module.exports = Tuteur;