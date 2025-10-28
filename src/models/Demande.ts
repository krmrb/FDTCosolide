export class Demande {
  constructor({ id, dateHeureDebut, dateHeureFin, codeEmploi, lieuTravail, motif, commentaire, statut, initiateur, solde } = {}) {
    this.id = id;
    this.dateHeureDebut = dateHeureDebut;
    this.dateHeureFin = dateHeureFin;
    this.codeEmploi = codeEmploi;
    this.lieuTravail = lieuTravail;
    this.motif = motif;
    this.commentaire = commentaire;
    this.statut = statut || 'Brouillon';
    this.initiateur = initiateur;
    this.solde = solde || 0;
  }

  estModifiable() {
    return ['Brouillon', 'Soumis', 'Modifié'].includes(this.statut);
  }

  estRetirable() {
    return ['Soumis', 'En attente d\'approbation'].includes(this.statut);
  }

  estTraitable() {
    return ['Soumis', 'En attente d\'approbation', 'En attente d\'une pièce justificative'].includes(this.statut);
  }
}