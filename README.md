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

