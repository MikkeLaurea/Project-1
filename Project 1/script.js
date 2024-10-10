// Hae viittaukset HTML-elementteihin
const taskInput = document.getElementById('taskInput'); // Syötekenttä tehtävän lisäämistä varten
const addTaskBtn = document.getElementById('addTaskBtn'); // Nappi, jolla lisätään uusi tehtävä
const taskList = document.getElementById('taskList'); // Lista (ul-elementti), johon tehtävät lisätään
const errorMsg = document.getElementById('errorMsg'); // Elementti, jossa näytetään virheviestit

// Hae viittaukset suodatinnappeihin
const allTasksBtn = document.getElementById('allTasksBtn'); // Nappi, joka näyttää kaikki tehtävät
const activeTasksBtn = document.getElementById('activeTasksBtn'); // Nappi, joka näyttää vain aktiiviset (ei suoritetut) tehtävät
const completedTasksBtn = document.getElementById('completedTasksBtn'); // Nappi, joka näyttää vain suoritetut tehtävät

// Lataa tallennetut tehtävät localStoragesta, kun sivu ladataan
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage); // Käynnistää tallennettujen tehtävien lataamisen, kun sivu on ladattu

// Funktio uuden tehtävän lisäämiseen
function addTask() {
    const taskText = taskInput.value.trim(); // Hae syötetty tehtäväteksti ja poista ylimääräiset välilyönnit

    clearError(); // Tyhjennä aiemmat virheilmoitukset

    // Tarkista, onko syötekenttä kelvollinen
    if (taskText === "") {
        displayError("Tehtävä ei voi olla tyhjä."); // Näytä virheviesti, jos tehtävä on tyhjä
        return;
    } else if (taskText.length < 3) {
        displayError("Tehtävä on liian lyhyt. Sen täytyy olla vähintään 3 merkkiä pitkä."); // Näytä virheviesti, jos tehtävä on liian lyhyt
        return;
    }

    // Luo uusi <li>-elementti tehtävää varten
    const li = document.createElement('li');
    
    // Luo ympyräelementti tehtävän suorittamisen merkkaamista varten
    const circle = document.createElement('span');
    circle.classList.add('circle'); // Lisää "circle"-luokka tyylitystä varten
    li.appendChild(circle); // Lisää ympyrä <li>-elementtiin

    // Lisää tehtävän teksti <li>-elementtiin
    li.appendChild(document.createTextNode(taskText));

    // Luo poistonappi tehtävälle
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X'; // Napin teksti
    deleteBtn.classList.add('deleteBtn'); // Lisää "deleteBtn"-luokka tyylitystä varten
    li.appendChild(deleteBtn); // Lisää poistonappi <li>-elementtiin

    // Lisää uusi tehtävä <li> tehtävälistaan <ul>
    taskList.appendChild(li);

    // Tyhjennä syötekenttä, kun tehtävä on lisätty
    taskInput.value = '';

    // Lisää tapahtumakuuntelija ympyrälle, jotta tehtävän voi merkitä tehdyksi/tekemättömäksi
    circle.addEventListener('click', function() {
        li.classList.toggle('completed'); // Vaihda "completed"-luokkaa, kun ympyrää klikataan
        saveTasksToLocalStorage(); // Tallenna päivitetyt tehtävät localStorageen
    });

    // Lisää tapahtumakuuntelija poistonapille, jotta tehtävä voidaan poistaa
    deleteBtn.addEventListener('click', function() {
        taskList.removeChild(li); // Poista tehtävä <li> tehtävälistasta
        saveTasksToLocalStorage(); // Tallenna päivitetyt tehtävät localStorageen
    });

    // Tallenna uusi tehtävälista localStorageen
    saveTasksToLocalStorage();
}

// Funktio virheilmoitusten näyttämiseen
function displayError(message) {
    errorMsg.textContent = message; // Aseta virheilmoitusteksti näkyviin
    taskInput.classList.add('error'); // Lisää "error"-luokka syötekenttään (esim. punainen reunus)
}

// Funktio, joka tyhjentää aiemmat virheilmoitukset
function clearError() {
    errorMsg.textContent = ''; // Tyhjennä virheilmoitusteksti
    taskInput.classList.remove('error'); // Poista "error"-luokka syötekentästä
}

// Funktio tehtävien tallentamiseen localStorageen
function saveTasksToLocalStorage() {
    const tasks = []; // Luo tyhjä taulukko tehtäviä varten

    // Käy läpi kaikki <li>-elementit tehtävälistassa
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.textContent.replace('Poista', '').trim(), // Hae tehtävän teksti ja poista "Poista"-napin teksti
            completed: li.classList.contains('completed') // Tarkista, onko tehtävä merkitty suoritetuksi
        });
    });

    // Tallenna tehtävätaulukko JSON-muodossa localStorageen
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Funktio, joka lataa tehtävät localStoragesta ja näyttää ne sivulla
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Lataa tehtävät localStoragesta tai aloita tyhjällä taulukolla

    // Käy läpi jokainen tallennettu tehtävä ja luo niille vastaava <li>-elementti
    tasks.forEach(task => {
        const li = document.createElement('li'); // Luo uusi <li> tehtävää varten

        const circle = document.createElement('span'); // Luo ympyrä tehtävän suorittamisen merkkaamiseen
        circle.classList.add('circle'); // Lisää "circle"-luokka tyylitystä varten
        li.appendChild(circle); // Lisää ympyrä <li>-elementtiin

        li.appendChild(document.createTextNode(task.text)); // Lisää tehtävän teksti <li>-elementtiin

        const deleteBtn = document.createElement('button'); // Luo poistonappi
        deleteBtn.textContent = 'Poista'; // Napin teksti
        deleteBtn.classList.add('deleteBtn'); // Lisää "deleteBtn"-luokka tyylitystä varten
        li.appendChild(deleteBtn); // Lisää poistonappi <li>-elementtiin

        // Tarkista, onko tehtävä merkitty suoritetuksi, ja lisää "completed"-luokka, jos se on tehty
        if (task.completed) {
            li.classList.add('completed');
        }

        taskList.appendChild(li); // Lisää tehtävä <li> tehtävälistaan

        // Lisää tapahtumakuuntelijan ympyrälle, jotta tehtävä voidaan merkitä suoritetuksi
        circle.addEventListener('click', function() {
            li.classList.toggle('completed');
            saveTasksToLocalStorage(); // Tallenna päivitetty tehtävätila localStorageen
        });

        // Lisää tapahtumakuuntelijan poistonapille, jotta tehtävä voidaan poistaa
        deleteBtn.addEventListener('click', function() {
            taskList.removeChild(li);
            saveTasksToLocalStorage(); // Tallenna päivitetty tehtävälista localStorageen
        });
    });
}

// Suodatin, joka näyttää kaikki tehtävät
allTasksBtn.addEventListener('click', function() {
    document.querySelectorAll('li').forEach(li => li.style.display = 'flex'); // Näytä kaikki tehtävät
});

// Suodatin, joka näyttää vain aktiiviset tehtävät (ei suoritetut)
activeTasksBtn.addEventListener('click', function() {
    document.querySelectorAll('li').forEach(li => {
        if (li.classList.contains('completed')) {
            li.style.display = 'none'; // Piilota suoritetut tehtävät
        } else {
            li.style.display = 'flex'; // Näytä aktiiviset tehtävät
        }
    });
});

// Suodatin, joka näyttää vain suoritetut tehtävät
completedTasksBtn.addEventListener('click', function() {
    document.querySelectorAll('li').forEach(li => {
        if (li.classList.contains('completed')) {
            li.style.display = 'flex'; // Näytä suoritetut tehtävät
        } else {
            li.style.display = 'none'; // Piilota aktiiviset (tekemättömät) tehtävät
        }
    });
});

// Lisää tapahtumakuuntelijan "Lisää tehtävä" -napille
addTaskBtn.addEventListener('click', addTask);

// Lisää tapahtumakuuntelijan syötekenttään, jotta tehtävän voi lisätä painamalla "Enter"
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask(); // Kutsuu addTask-funktiota, jos "Enter"-näppäintä painetaan
    }
});