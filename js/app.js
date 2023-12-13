const checkIfEmptyValue = (object) => {
  let isEmpty = false;
  for (const property in object) {
    if (object[property] == "") {
      isEmpty = true;
    }
  }
  return isEmpty;
};

const showSuccessMessage = (message) => {
  Swal.fire({
    position: "center-center",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
};

const showErrorMessage = (message) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
    footer: '<a href="#">Why do I have this issue?</a>',
  });
};

const App = {
  data() {
    return {
      showHome: false,
      showCreateForm: false,
      showStudentList: false,
      newStudent: {
        nom: "",
        prenom: "",
        dateNaissance: "",
        niveauScolaire: "",
      },
      students: [],
    };
  },

  mounted() {
    this.changeNavigationState("home");
    this.displayStudents();
  },

  methods: {
    goToHome() {
      this.changeNavigationState("home");
    },

    goToCreateForm() {
      this.changeNavigationState("create");
    },

    goToStudentList() {
      this.changeNavigationState("list");
    },

    submitStudent() {
      if (!checkIfEmptyValue(this.newStudent)) {
        if (!checkIfStudentExist(this.newStudent.nom, this.newStudent.prenom)) {
          addStudent(this.newStudent);
          this.newStudent = {
            nom: "",
            prenom: "",
            dateNaissance: "",
            niveauScolaire: "",
          };
          showSuccessMessage("Étudiant ajouté avec succés !");
        } else {
          showErrorMessage("Cet étudiant existe déjà.");
        }
      } else {
        showErrorMessage("Veuillez remplir tous les champs.");
      }
    },

    changeNavigationState(destination) {
      this.showHome = false;
      this.showCreateForm = false;
      this.showStudentList = false;

      switch (destination) {
        case "home":
          this.showHome = true;
          break;
        case "create":
          this.showCreateForm = true;
          break;
        case "list":
          this.showStudentList = true;
          break;

        default:
          this.showHome = true;
          break;
      }
    },
    displayStudents() {
        this.students = getLocalDB().map(student => {
          return { ...student, editing: false }; // Ajoutez la propriété 'editing' à chaque étudiant
        });
      },
      searchStudent() {
        if (this.searchText.trim() !== '') {
            // Si le champ de recherche n'est pas vide
            const searchedStudents = searchStudentByName(this.searchText.trim());
            // Utilisation de la fonction searchStudentByName avec le texte de recherche

            // Mettre à jour la liste des étudiants à afficher avec les résultats de la recherche
            this.students = searchedStudents;
        } else {
            // Si le champ de recherche est vide, réinitialiser la liste des étudiants
            this.students = getLocalDB();
        }
    },
    clickEditStudent(student) {
      // Mettez à jour l'interface utilisateur ou redirigez vers un formulaire d'édition
      console.log("Édition de l'étudiant:", student);
    },
    editStudent(student) {
      student.editing = true; // Ajoutez une propriété 'editing' à l'étudiant pour indiquer l'édition
    },
    saveEditedStudent(student) {
      student.editing = false; // Désactivez le mode édition
      updateStudent(student); // Utilisez la fonction pour mettre à jour l'étudiant dans la base de données
      // Rafraîchissez la liste des étudiants après la mise à jour
      this.displayStudents();
      showSuccessMessage("L'étudiant(e) a été modifié avec succés");
    },
    
    clickDeleteStudent(student) {
      // Utilisez la fonction deleteStudent du fichier api.js pour supprimer l'étudiant du local storage
      deleteStudent(student);
      // Mettez à jour la liste des étudiants après la suppression
      this.displayStudents();
    },
  },
};

Vue.createApp(App).mount("#app");
