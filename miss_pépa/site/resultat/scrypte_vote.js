document.addEventListener('DOMContentLoaded', () => {
    const candidates = [
        { id: 1, name: "ADJAKOTAN Esther", photo: "etudiante_1.jpeg", votes: 0 },
        { id: 2, name: "AGOSSA Marielle", photo: "etudiante_2.jpeg", votes: 0 },
        { id: 3, name: "LANMAYIKPOHOUE Jenifer Gertrude", photo: "etudiante_3.jpeg", votes: 0 },
        { id: 4, name: "ZOFFOUN Belvida", photo: "etudiante_4.png", votes: 0 },
        { id: 5, name: "VITCHOEKE Jeanelle", photo: "etudiante_5.jpeg", votes: 0 },
        { id: 6, name: "KINTI Esther", photo: "etudiante_6.jpeg", votes: 0 },
        { id: 7, name: "ISSA Roliath", photo: "etudiante_7.jpeg", votes: 0 },
        { id: 8, name: "DJIDONOU Hérita", photo: "etudiante_8.png", votes: 0 },
        { id: 9, name: "AKODJENOU Rifiène", photo: "etudiante_9.png", votes: 0 },
        { id: 10, name: "BOURAÏMA Fumilayo", photo: "etudiante_10.png", votes: 0 },
        { id: 11, name: "DOFLIN Gisèle", photo: "etudiante_11.jpeg", votes: 0 },
        { id: 12, name: "GOHY Christy", photo: "etudiante_12.jpeg", votes: 0 },
        { id: 13, name: "DJOBOSSO Firdaosse", photo: "etudiante_13.jpeg", votes: 0 },
        { id: 14, name: "GUELIVOH Exaucée", photo: "etudiante_14.jpeg", votes: 0 },
        { id: 15, name: "BODJENOU Laurinda", photo: "etudiante_15.png", votes: 0 },
        { id: 16, name: "DJIGBEGNONHOU Ida Constantine", photo: "etudiante_16.png", votes: 0 },
        { id: 17, name: "AREMOU Hanyath", photo: "etudiante_17.jpeg", votes: 0 },
        { id: 18, name: "EDEMESSI Océane", photo: "etudiante_18.png", votes: 0 }
    ];

   // Trier par votes décroissants
   candidates.sort((a, b) => b.votes - a.votes);

   const container = document.getElementById('candidatesList');
   
   // Créer les cartes avec des tailles adaptées
   candidates.forEach(candidate => {
       const card = document.createElement('div');
       card.className = 'candidate-card';
       
       card.innerHTML = `
           <div class="candidate-info">
               <img src="${candidate.photo}" alt="${candidate.name}" 
                    class="candidate-photo" loading="lazy"
                    style="min-width: 60px;"> <!-- Assurance min-width -->
               <div class="candidate-details">
                   <span class="candidate-name">${candidate.name}</span>
                   <span class="candidate-id">Candidate #${candidate.id}</span>
               </div>
           </div>
           <div class="vote-results">
               <span class="vote-count">${candidate.votes}</span>
               <span class="vote-label">VOTES</span>
           </div>
       `;
       
       container.appendChild(card);
   });

   // Détection mobile pour ajustements supplémentaires
   if (/Mobi|Android/i.test(navigator.userAgent)) {
       document.body.classList.add('is-mobile');
   }
});