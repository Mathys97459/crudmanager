const STUDENTDB = "StudentDB";

function getLocalDB() {
  //retourner la base de données
  if (!localStorage.getItem(STUDENTDB)) {
    localStorage.setItem(STUDENTDB, JSON.stringify([]));
    //Convertir de STUDENTDB en string avec "JSON.stringify" car le localStorage ne supporte pas les tableaux
  }
  return JSON.parse(localStorage.getItem(STUDENTDB)); //Reconversion de STUDENTDB en tableau
}

//fonction mettre à jour la BDD
function updateDB(db) {
  localStorage.setItem(STUDENTDB, JSON.stringify(db));
}

//fonction ajout étudiant
function addStudent(student) {
  const db = getLocalDB();
  student.id = Date.now() + "";
  db.push(student);
  updateDB(db);
}

//fonction mettre à jour l'étudiant
function updateStudent(student) {
  const db = getLocalDB();
  const updatedDb = db.map(function (curStudent) {
    if (curStudent.id == student.id) {
        //AJOUTER UNE VERIFICATION DE CHAMPS VIDE
      return {
        nom: student.nom,
        prenom: student.prenom,
        dateNaissance: student.dateNaissance,
        niveauScolaire: student.niveauScolaire,
        id: student.id,
      };
    }
    return curStudent;
  });

  updateDB(updatedDb);
}

//fonction pour supprimer un étudiant
function deleteStudent(student) {
  const db = getLocalDB();
  const updatedDb = db.filter(function (curStudent) {
    //La fonction va recréer un tableau avec tous les étudiants qui ont un id différent de celui de student
    return curStudent.id != student.id; //filtre d'id : verif si l'id est différent
  });
  updateDB(updatedDb);
}

//fonction récupérer l'étudiant par rapport à son id
function getStudent(id) {
  const db = getLocalDB();
  var filteredDb = db.filter((data) => data.id == id);
  if (filteredDb.lenght > 0) {
    return filteredDb[0];
  }
  return null;
}

//fonction recherche d'étudiant
function searchStudentByName(name) {
  const db = getLocalDB();
  const filteredDb = db.filter((data) => {
    return (
      data.nom.toLowerCase().includes(name.toLowerCase()) ||
      data.prenom.toLowerCase().includes(name.toLowerCase())
    );
  });

  return filteredDb;
}


function checkIfStudentExist(name, firstname) {
    const db = getLocalDB();
    const filteredDb = db.filter((data) => {
      return data.nom.toLowerCase() == name.toLowerCase() && data.prenom.toLowerCase() == firstname.toLowerCase()
    })
  
    return filteredDb.length > 0 // créé une nouveau tableau avec les étudiants ayant le meme nom et prénom. Si le tableau n'est pas vide (>0), c'est qu'il y a des doublons
  }