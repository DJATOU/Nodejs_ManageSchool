const client = require('../models/db');
const express = require('express');
const email = require('../tools/email');
const Eleve = require('../models/eleve');
const Tuteur = require('../models/tuteur');
var color = require('colors');
const router = express.Router();

// Récupérer tous les établissement
router.get('/getAllEtablissement', (req,res,next) => {
  client.query("SELECT * FROM ecole.tetablissement", (err, result) => {
    if(err){
      console.log(err);
      res.status(404).send(err);
    }
    console.log('OK'.underline.red)
    res.status(200).send(result.rows);
  });
});

// Récupérer toutes les moyennes de tous les étudiants

router.get('/getMoyennes',(req,res,next) => {
  client.query("SELECT moyenne FROM ecole.televe_anneescolaire", (err, result) => {
    if(err){
      console.log(err);
      res.status(404).send(err);
    }
    console.log('DONE')
    res.status(200).send(result.rows);
  });
});

//Ajouter un tuteur

router.post('/ajouterTuteur', (req,res,next) => {

  var tuteur = new Tuteur(req.body.nom, req.body.prenom, req.body.numero, req.body.email)

  client.query("SELECT * FROM ecole.add_tuteur($1,$2,$3,$4)", [tuteur.getNom(),tuteur.getPrenom(),tuteur.getnumeroTel(),
    tuteur.getMail()], (err,result) => {
    if(err){
      console.log(err);
      res.status(400).send(err);
      next();
    }else{
      console.log(result);
      res.status(200).send(req.body);
    }
  });
});

// Ajouter un élève

router.post('/ajouterEleve', (req, res, next) => {
    
    var mailOpt = email.mailOptions;
    var sendEmail = email.sendEmail;

    var eleve = new Eleve(req.body.nom, req.body.prenom, req.body.dateNaissance, req.body.lieuNaissance, 
                          req.body.numeroTel,req.body.email,req.body.tuteur, req.body.annee_scolaire, 
                          req.body.etablissement,req.body.niveau, req.body.moyenne)
     
     mailOpt.subject = 'Ecole - Inscription élève';
     mailOpt.to = 'ecole.wahran@gmail.com,'+eleve.getEmail();
     mailOpt.text = "L'élève "+eleve.getPrenom()+" "+eleve.getNom()+" a bien été ajouté à l'application !";

      client.query("SELECT * FROM ecole.add_eleve($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
      [eleve.getNom(),eleve.getPrenom(),eleve.getdateNaissance(),eleve.getlieuNaissance(),eleve.getnumeroTel(),eleve.getEmail(),
        eleve.getTuteur(),eleve.getAnneScolaire(),eleve.getEtablissement(),eleve.getNiveau(),eleve.getMoyenne()],
      function(err, result){
        if(err){
          res.status(400).send(err);
          console.log(err);
          next();
        } else{
            console.log(result);
             res.status(200).send(req.body);
             // Envoie du mail si c'est OK
             sendEmail(mailOpt);
          }
        });       
});
// Modifier un élève 

router.put('/modifierEleve',  (req, res, next) => {
  console.log(req.body)

  var eleve = new Eleve(req.body.nom, req.body.prenom, req.body.dateNaissance, req.body.lieuNaissance, 
    req.body.numeroTel,req.body.email,req.body.tuteur, req.body.annee_scolaire, 
    req.body.etablissement,req.body.niveau, req.body.moyenne, req.body.idDb);

    client.query("SELECT * FROM ecole.upd_eleve($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",
    [eleve.getId(),eleve.getNom(),eleve.getPrenom(),eleve.getdateNaissance(),eleve.getlieuNaissance(),
      eleve.getnumeroTel(),eleve.getEmail(),eleve.getTuteur(),eleve.getAnneScolaire(),eleve.getEtablissement(),
      eleve.getNiveau(),eleve.getMoyenne()], function(err, result){
      if(err){
        res.status(400).send(err);
        console.log(err);
        next();
      } else{
          console.log(result);
           res.status(200).send(req.body);
        }
      });       
});

// Récuperer tous les élèves
router.get('/afficherEleve', function (req, res, next) {
  client.query('SELECT * from ecole.televe' ,function(err,result) {
      if(err){
          console.log(err);
          res.status(400).send(err);
      }
       res.status(200).send(result.rows);
  });
});

// Supprimer un élève 

router.delete('/deleteStudent/:id', (req,res,next) =>
{
   var id = req.params.id;
   var mailOpt = email.mailOptions;
   var sendEmail = email.sendEmail;

  
    mailOpt.subject = 'Ecole - Suppression élève '+id;
    mailOpt.to = 'ecole.wahran@gmail.com';
    mailOpt.text = "L'élève id : "+ id + " a bien été supprimé de l'application !";



    client.query("SELECT * FROM ecole.del_eleve($1)", [id], (err, result) => {
      if(err) {
        console.log(err.stack);
        res.status(400).send(err);
        next();
      } else {
        console.log(result.rows);
        res.status(200).send(result.rows);
        sendEmail(mailOpt);
      }
    });
});

// Récupére les informations sur un etudiant
router.get('/detailsStudent/:id', (req,res,next) => {
  var idStudent = req.params.id;
  client.query("SELECT * FROM ecole.get_eleve_full($1)", [idStudent], (err,result) => {
    if(err){
      console.log(err);
      res.status(400).send(err);
      next();
    }else{
      console.log(result);
      res.status(200).send(result.rows);
    }
  });
});

// Récuperer tous les tuteurs 
router.get('/getAllTuteur', function (req, res, next) {
  client.query('SELECT * from ecole.ttuteur' ,function(err,result) {
      if(err){
          console.log(err);
          res.status(400).send(err);
      }
       res.status(200).send(result.rows);
  });
});

// Récuperer toutes les années scolaire
router.get('/getAllAnnees', function (req, res, next) {
  client.query('SELECT * from ecole.tannee_scolaire' ,function(err,result) {
      if(err){
          console.log(err);
          res.status(400).send(err);
      }
       res.status(200).send(result.rows);
  });
});

//Recup tt les groupes
router.get('/getAllGroups', (req,res,next) => {
  client.query('SELECT * from ecole.tgroupe' ,function(err,result) {
    if(err){
        console.log(err);
        res.status(400).send(err);
    }
     res.status(200).send(result.rows);
  });
});

// Recup tt les tarifs
router.get('/getAllTarifs', (req,res,next) => {
  client.query('SELECT * from ecole.tprix' ,function(err,result) {
    if(err){
        console.log(err);
        res.status(400).send(err);
    }
     res.status(200).send(result.rows);
  });
});


// Ajout d'un étudiant à un groupe
router.post('/addStudentGroup', (req,res,next) => {
  idStudent = req.body.idDb;
  idGroup = req.body.groupe.id;
  tarif = req.body.tarif.prix;
  dateDebut = req.body.dateDebut;
  dateFin = req.body.dateFin;

  client.query("SELECT * FROM ecole.add_prix_eleve_groupe($1,$2,$3,$4,$5)", [idStudent,idGroup,tarif,dateDebut,dateFin], (err,result) => {
    if(err){
      console.log(err);
      res.status(400).send(err);
      next();
    }else{
      console.log(result);
      res.status(200).send(req.body);
    }
  });
});

// Supprimer un étudiant d'un groupe

router.delete('/deleteStudentFromGroup/:idStudent/:idGroup', (req,res,next) => {
  var idStudent = req.params.idStudent;
  var idGroup = req.params.idGroup;

  console.log(idStudent)
  console.log(idGroup)

  client.query('SELECT * from ecole.del_student_from_groupe($1, $2)', [idGroup,idStudent] ,function(err,result) {
    if(err){
        console.log(err);
        res.status(400).send(err);
    }
     res.status(200).send(result.rows);
  });

})

// Récupére les groupes d'un eleve
router.get('/getGrouspOfEleve/:id', (req,res,next) => {
  var idStudent = req.params.id;
  console.log(idStudent)

  client.query('SELECT * from ecole."get_groupsOf_eleve"($1)', [idStudent] ,function(err,result) {
    if(err){
        console.log(err);
        res.status(400).send(err);
    }
     res.status(200).send(result.rows);
  });
});

// Recupère les élèves d'un groupe
router.get('/getEleveGroupe/:id', (req,res,next) => {
  var idStudent = req.params.id;
  console.log(idStudent)

  client.query('SELECT * from ecole."get_eleveOf_groupe"($1)', [idStudent], (err,result) => {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    }
    res.status(200).send(result.rows);
  });
});


// Récup un groupe par ID
router.get('/getGroup/:id',(req,res,next) => {
  var idGroup = req.params.id;
  console.log(typeof(idGroup));

  client.query("SELECT * FROM ecole.tgroupe WHERE id = '"+idGroup+"'", (err, result) => {
    if(err){
      console.log(err);
      res.status(404).send(err);
    }
    console.log('DONE')
    res.status(200).send(result.rows);
  });
});

// Ajout d'un groupe
router.post('/addGroup', (req,res,next) => {
  var matiere = req.body.matiere;
  var label = req.body.label;
  var type = req.body.type;
  var niveau = req.body.niveau;

  client.query('SELECT * from ecole.add_groupe($1,$2,$3,$4)',[matiere,label,type,niveau], (err,result) => {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    }
    res.status(200).send(result.rows);
  });
});

//Modification d'un groupe

router.put('/updateGroup', (req,res,next) => {
  var id = req.body.id;
  var matiere = req.body.matiere;
  var label = req.body.label;
  var niveau = req.body.niveau;
  var type = req.body.type;

  client.query("SELECT * FROM ecole.upd_groupe($1,$2,$3,$4,$5)", [id,matiere,label,type,niveau], (err, result) => {
    if(err) {
      console.log(err.stack);
      res.status(400).send(err);
      next();
    } else {
      console.log(result.rows);
      res.status(200).send(result.rows);
    }
  });
});


// Supression d'un groupe
router.delete('/deleteGroup/:id', (req,res,next) => {
  var id = req.params.id;
  console.log(id)
  client.query("SELECT * FROM ecole.del_group($1)", [id], (err, result) => {
    if(err) {
      console.log(err.stack);
      res.status(400).send(err);
      next();
    } else {
      console.log(result.rows);
      res.status(200).send(result.rows);
    }
  });
});

// Ajouter un établissement
router.post('/addEtablissement', (req,res,next) => {
  var nom = req.body.nom;
  var adresse = req.body.adresse;

  client.query("SELECT * FROM ecole.add_etablissement($1,$2)", [nom, adresse], (err, result) => {
    if(err) {
      console.log(err.stack);
      res.status(400).send(err);
      next();
    } else {
      console.log(result.rows);
      res.status(200).send(result.rows);
    }
  });
});

// Suppression d'un établissement
router.delete('/deleteEtablissement/:id', (req,res,next) => {
  var id = req.params.id;

  client.query("SELECT * FROM ecole.del_etablissement($1)", [id], (err, result) => {
    if(err) {
      console.log(err.stack);
      res.status(400).send(err);
      next();
    } else {
      console.log(result.rows);
      res.status(200).send(result.rows);
    }
  });
});


// Modification d'un etablissement
router.put('/modifierEtablissement',  (req, res, next) => {
  console.log(req.body)
  var id = req.body.id;
  var nom = req.body.nom;
  var adresse = req.body.adresse;

  console.log(id);
  console.log(nom);
  console.log(adresse)

    client.query("SELECT * FROM ecole.upd_etablissement($1,$2,$3)",[id, nom, adresse], function(err, result){
      if(err){
        res.status(400).send(err);
        console.log(err);
        next();
      } else{
          console.log(result);
           res.status(200).send(req.body);
        }
      });       
});

router.get('/allProfs', (req,res,next) => {
  client.query("SELECT * FROM ecole.get_all_professor()", (error,result) => {
    if(error) {
      res.status(404).send(error);
    } else {
      console.log(result);
      res.status(200).send(result.rows)
    }
  })
});

router.post('/addProf', (req,res,next) => {

  console.log(req.body);
  var nom = req.body.nom;
  var prenom = req.body.prenom;
  var dateNaissance = req.body.dateNaissance;
  var lieuNaissance = req.body.lieuNaissance;
  var telephone = req.body.telephone;
  var email = req.body.email;

  client.query("SELECT * FROM ecole.add_professor($1,$2,$3,$4,$5,$6)", [nom,prenom,dateNaissance,lieuNaissance,telephone,email], (error,result) => {
    if(error) {
      res.status(404).send(error);
    } else {
      console.log(result);
      res.status(200).send(result.rows)
    }
  })
})




 
module.exports= router; 