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
      navigationState: "home",
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
    const savedState = localStorage.getItem("navigationState");
    if (savedState) {
      this.changeNavigationState(savedState);
    }else{
      this.changeNavigationState("home");
    }
    this.displayStudents();
  },

  methods: {
    goToHome() {
      this.changeNavigationState("home");
      this.navigationState = "home";
      localStorage.setItem("navigationState", this.navigationState);
    },

    goToCreateForm() {
      this.changeNavigationState("create");
      this.navigationState = 'create';
      localStorage.setItem('navigationState', this.navigationState);
    },

    goToStudentList() {
      this.changeNavigationState("list");
      this.navigationState = 'list';
      localStorage.setItem('navigationState', this.navigationState);
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
      this.students = getLocalDB().map((student) => {
        return { ...student, editing: false }; // Ajoutez la propriété 'editing' à chaque étudiant
      });
    },
    searchStudent() {
      if (this.searchText.trim() !== "") {
        // Si le champ de recherche n'est pas vide
        const searchedStudents = searchStudentByName(this.searchText.trim());
        this.students = searchedStudents;
      } else {
        // Si le champ de recherche est vide on réinitialise la liste des étudiants
        this.students = getLocalDB();
      }
    },
    clickEditStudent(student) {
      console.log("Édition de l'étudiant:", student);
    },
    editStudent(student) {
      student.editing = true;
    },
    saveEditedStudent(student) {
      if (
        student.nom.trim() === "" ||
        student.prenom.trim() === "" ||
        student.dateNaissance.trim() === "" ||
        student.niveauScolaire.trim() === ""
      ) {
        showErrorMessage(
          "Veuillez remplir tous les champs avant de sauvegarder les modifications."
        );
        return; // Arrêtez l'exécution de la fonction si un champ est vide
      }
      student.editing = false;
      updateStudent(student);
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

Vue.createApp(App).mount('#app');
