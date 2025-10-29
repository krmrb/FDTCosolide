
export default class DemandePaiement {
  constructor({
    id,
    matricule,
    demandePar,
    demandeLe,
    dateDemande,
    heureDebut,
    heureFin,
    corpsEmploi,
    lieuTravail,
    typePaiement,
    noteDemande,
    noteApprobation,
    etat,
    minutesTachesEducatives = null,
    minutesTachesAutres = null
  }) {
    this.id = id;
    this.matricule = matricule;
    this.demandePar = demandePar;
    this.demandeLe = demandeLe;
    this.dateDemande = dateDemande;
    this.heureDebut = heureDebut;
    this.heureFin = heureFin;
    this.corpsEmploi = corpsEmploi;
    this.lieuTravail = lieuTravail;
    this.typePaiement = typePaiement;
    this.noteDemande = noteDemande;
    this.noteApprobation = noteApprobation;
    this.etat = etat;
    this.minutesTachesEducatives = minutesTachesEducatives;
    this.minutesTachesAutres = minutesTachesAutres;
  }

  estModifiable() {
    return this.etat === 'Brouillon' || this.etat === 'Modifié';
  }

  estRetirable() {
    return ['Brouillon', 'Soumis', 'Modifié'].includes(this.etat);
  }

  estTraitable() {
    return ['Soumis', 'En attente d\'approbation'].includes(this.etat);
  }
}
