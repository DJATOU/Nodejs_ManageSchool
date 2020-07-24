function Eleve(nom ,prenom,dateNaissance,lieuNaissance,numeroTel,email,tuteur,annee_scolaire,etablissement,niveau,moyenne,idDb){
        this.nom = nom;
        this.prenom = prenom;
        this.dateNaissance = dateNaissance;
        this.lieuNaissance = lieuNaissance;
        this.numeroTel = numeroTel;
        this.email = email;
        this.tuteur = tuteur;
        this.annee_scolaire = annee_scolaire;
        this.etablissement = etablissement;
        this.niveau = niveau;
        this.moyenne = moyenne;
        this.idDb = idDb;
    }

    Eleve.prototype.getNom = function(){ return this.nom;}
    Eleve.prototype.getPrenom = function(){ return this.prenom;}
    Eleve.prototype.getdateNaissance = function(){ return this.dateNaissance;}
    Eleve.prototype.getlieuNaissance = function(){ return this.lieuNaissance;}
    Eleve.prototype.getnumeroTel = function(){ return this.numeroTel;}
    Eleve.prototype.getEmail = function(){ return this.email;}
    Eleve.prototype.getTuteur = function(){ return this.tuteur;}
    Eleve.prototype.getAnneScolaire = function(){ return this.annee_scolaire;}
    Eleve.prototype.getEtablissement = function(){ return this.etablissement;}
    Eleve.prototype.getNiveau = function(){ return this.niveau;}
    Eleve.prototype.getMoyenne = function(){ return this.moyenne;}
    Eleve.prototype.getId = function(){ return this.idDb;}


module.exports = Eleve;