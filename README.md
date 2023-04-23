# mock-todos-server

JSON server dell'app todo-app: https://github.com/alebar95/todo-app

Installare Docker sulla propria macchina se non presente.

Clonare il progetto, portarsi nella root del progetto e lanciare il comando:

docker build . -t mock-todos-server

Una volta creata l'immagine, eseguirla in un container con il comando:

docker run -d -p 3000:3000 --name mock-todos-server mock-todos-server

All'interno della root del progetto è stato aggiunto il file deployment.yaml che contiene la definizione dell'oggetto kubernetes deployment per poter eseguire l'immagine Docker mock-todos-server all'interno di un cluster Kubernetes locale, eseguito dal Docker Desktop.

All'interno del file deployment.yaml è presente anche la definizione yaml di un Service che consente di esporre l’applicazione per l’accesso dall’esterno del cluster kubernetes.

Abilitare Kubernetes nel Docker Desktop eseguendo quindi un cluster avente un unico nodo docker-desktop.

Verificare che il nodo docker-desktop sia stato creato lanciando il comando:

kubectl get nodes

All'interno della root del progetto lanciare il comando:

kubectl apply -f deployment.yaml

Verificare la corretta esecuzione dell'app nel cluster kubernetes lanciando il comando:

kubectl get pods

Verificare il funzionamento del server provando a lanciare da terminale il seguente comando

curl http://localhost:31200/todos. (la porta 31200 è stata settata nella definizione del service nel file deployment.yaml)

se il server è correttamente in esecuzione nel container Docker all'interno del cluster Kubernetes, la chiamata dovrebbe restituire i dati contenuti nel file db.json

le api esposte dal server sono protette da verifica di un JWT token grazie all'IAM keycloak.

Per poter ricevere quindi una risposta che non sia 403 Forbidden, occore:

    eseguire il server di autenticazione di keycloak in un container docker lanciando il comando:

  docker run -e -p 8180:8080  KEYCLOAK_USER=<USERNAME> -e KEYCLOAK_PASSWORD=<PASSWORD> jboss/keycloak

  indicando lo username e la password a proprio piacimento (per. es admin admin)

   Una volta che il server di keycloak è correttamente in esecuzione, è possibile accedere all'admin console di tale server all'indirizzo http://localhost:8180/auth

      - Creare un realm chiamandolo "todos-realm";
      - Crere un client associato al json-server node, chiamandolo "mock-todos-server";
      - Settare Acces-Type a "confidential";
      - Inserire come redirect urls:
                "http://localhost:3000/*"
                "http://localhost:31200/*"
      - Settare Service Account Enabled a ON;
      - Settare Authorization Enabled a ON;
      - Andare nella sezione Roles del Client e aggiungere un Ruolo di nome admin;
      - Andare nella sezione Roles del Ream e aggungere un Ruolo Realm di nome app-admin;
      - Per il ruolo di realm app-admin settare "Composite roles" ad ON;
      - Settare Client Roles per mock-todos-server aggiungendo app-admin;
      - Andare nella sezione Users del realm ed aggiungere un utente con le seguenti credenziali:
                    username: user1
                    password: user1
      - Andare nella sezione Role Mappings e assegnare a tale utente il ruolo di realm app-admin;
      
      Per poter testare la chiamata che restituisce il token occorre andare nella sezione Realm Settings -> General -> Endpoints : cliccare su OpenId EndpointConfiguration, si aprirà un json, l'endpoint per l'acces token si troverà nel campo "token_endpoint".

      Testare la chiamata di ottenimento del token inserendo l'url trovata in "token_enpoint"
      e passando un body nel formato x-www-form-urlencoded con i seguenti valori:
            grant_type: password
            username: user1
            password: user1
            client_id: mock-todos-server
            client_secret: ${Il client secret indicato nella sezione credentials del client mock-todos-server nella console dell'admin keycloak}

      Se si ottiene correttamenteun token da questa chiamata, è possibile a questo punto testare
      il nostro json servber inviando il token (nell'header Authorization come bearer token) nell'header della chiamata http://localhost:31200/todos




