<template>
  <div class="container d-flex justify-content-center">
    <div class="col-md-10">

      <!-- Données personnelles -->
      <div class=" mt-4 p-4">
        <h3>Données personnelles</h3>
        <p>
          Voici vos informations personnelles telles qu’inscrites à votre dossier d’employé.
          Si vous remarquez qu’une de ces informations est erronée ou que vous avez changé d’adresse,
          communiquez avec le service des ressources humaines.
        </p>

        <!-- Nom et prénom -->
        <div class="row mb-3">
          <div class="col-md-6">
            <strong>Nom à la naissance</strong>
            <div>{{ form.nomNaissance }}</div>
          </div>
          <div class="col-md-6">
            <strong>Prénom</strong>
            <div>{{ form.prenom }}</div>
          </div>
        </div>

        <!-- Adresse -->
        <div class="mb-3">
          <strong>Adresse</strong>
          <div>{{ form.adresse }}</div>
        </div>

        <!-- Barre bleue de séparation -->
        <div class="border-top border-3 border-primary my-4"></div>

        <!-- Pour vous joindre -->
        <h5>Pour vous joindre...</h5>
        <p>
          Complétez les informations suivantes afin que le service des ressources humaines puisse vous joindre au besoin.
          L’adresse courriel est requise et vous pouvez sélectionner à laquelle des deux adresses courriel vous souhaitez recevoir les communications de votre service des ressources humaines.
          Vous pouvez utiliser votre « Adresse courriel » ou votre « Adresse courriel du portail » pour vous connecter avec Mozaïk.
        </p>

      </div>



      <!-- Contact -->
      <div class="bg-light mt-4 p-4">
        <h3>Contact</h3>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="tel">Téléphone</label></div>
          <div class="col-md-5">
            <input id="tel" type="text" class="form-control" v-model="form.tel" placeholder="ex: (555) 555-5555" />
          </div>
        </div>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="telCell">Téléphone (cellulaire)</label></div>
          <div class="col-md-5">
            <input id="telCell" type="text" class="form-control" v-model="form.telCellulaire" placeholder="ex: (555) 555-5555" />
          </div>
        </div>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="telTravail">Téléphone (travail)</label></div>
          <div class="col-md-5">
            <input id="telTravail" type="text" class="form-control" v-model="form.telTravail" placeholder="ex: (555) 555-5555" />
          </div>
        </div>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="posteTravail">Poste (travail)</label></div>
          <div class="col-md-5">
            <input id="posteTravail" type="text" class="form-control" v-model="form.posteTravail" placeholder="ex: 555" />
          </div>
        </div>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="emailPro">Adresse courriel professionnelle</label></div>
          <div class="col-md-5">
            <input id="emailPro" type="email" class="form-control" v-model="form.emailPro" disabled />
          </div>
        </div>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="emailPerso">Adresse courriel personnelle</label></div>
          <div class="col-md-5">
            <input id="emailPerso" type="email" class="form-control" v-model="form.emailPerso" placeholder="ex: courriel@moncourriel.com" />
          </div>
        </div>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="emailComm">Adresse courriel pour les communications</label></div>
          <div class="col-md-5">
            <select id="emailComm" class="form-select" v-model="form.emailComm">
              <option value="personnelle">Personnelle</option>
              <option value="professionnelle">Professionnelle</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Changement d'adresse -->
      <div class="bg-light mt-4 p-4">
        <h3>Changement d'adresse</h3>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="dateEffective">Date effective</label></div>
          <div class="col-md-5">
            <input id="dateEffective" type="date" class="form-control" v-model="form.dateEffective" />
          </div>
        </div>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="adresse">Adresse</label></div>
          <div class="col-md-5">
            <input id="adresse" type="text" class="form-control" v-model="form.adresse" />
          </div>
        </div>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="villeProvince">Ville et province</label></div>
          <div class="col-md-5">
            <input id="villeProvince" type="text" class="form-control" v-model="form.villeProvince" />
          </div>
        </div>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="codePostal">Code postal</label></div>
          <div class="col-md-5">
            <input id="codePostal" type="text" class="form-control" v-model="form.codePostal" />
          </div>
        </div>
      </div>

      <!-- Contact d'urgence 1 -->
      <div class="bg-light mt-4 p-4">
        <h3>Contact d'urgence 1</h3>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="urgence1Nom">Nom du contact</label></div>
          <div class="col-md-5">
            <input id="urgence1Nom" type="text" class="form-control" v-model="form.urgence1.nom" />
          </div>
        </div>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="urgence1Tel">Téléphone d'urgence</label></div>
          <div class="col-md-5">
            <input id="urgence1Tel" type="text" class="form-control" v-model="form.urgence1.tel" />
          </div>
        </div>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="urgence1Poste">Poste téléphonique</label></div>
          <div class="col-md-5">
            <input id="urgence1Poste" type="text" class="form-control" v-model="form.urgence1.poste" />
          </div>
        </div>
      </div>

      <!-- Contact d'urgence 2 -->
      <div class="bg-light mt-4 p-4">
        <h3>Contact d'urgence 2</h3>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="urgence2Nom">Nom du contact</label></div>
          <div class="col-md-5">
            <input id="urgence2Nom" type="text" class="form-control" v-model="form.urgence2.nom" />
          </div>
        </div>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="urgence2Tel">Téléphone d'urgence</label></div>
          <div class="col-md-5">
            <input id="urgence2Tel" type="text" class="form-control" v-model="form.urgence2.tel" />
          </div>
        </div>

        <div class="row list-unstyled d-flex justify-content-between mb-2">
          <div class="col-md-7"><label for="urgence2Poste">Poste téléphonique</label></div>
          <div class="col-md-5">
            <input id="urgence2Poste" type="text" class="form-control" v-model="form.urgence2.poste" />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'DonneesPersonnellesBody',
    data() {
      return {
        form: {
          nomNaissance: 'Doiron',
          prenom: 'Cédric',
          adresse: '2080, Avenue Andre-sabourin Saint-hyacinthe, Qc J2X 7W2',

          tel: '',
          telCellulaire: '',
          telTravail: '',
          posteTravail: '',
          emailPro: '',
          emailPerso: '',
          emailComm: 'personnelle',
          dateEffective: '',
          adresse: '',
          villeProvince: '',
          codePostal: '',
          urgence1: {
            nom: '',
            tel: '',
            poste: ''
          },
          urgence2: {
            nom: '',
            tel: '',
            poste: ''
          }
        }
      };
    }
  };
</script>
<style>

  .container {
    color: #656565;
  }

</style>
