# mock-todos-server

JSON server dell'app todo-app: https://github.com/alebar95/todo-app

Installare Docker sulla propria macchina se non presente.

Clonare il progetto, portarsi nella root del progetto e lanciare il comando:

docker build . -t mock-todos-server

Una volta creata l'immagine, eseguirla in un container con il comando:

docker run -d -p 3000:3000 --name mock-todos-server mock-todos-server

Verificare il funzionamento del server provando a lanciare da terminale il seguente comando

curl http://localhost:3000/todos

se il server è correttamente in esecuzione nel container, la chiamata dovrebbe restituire i dati contenuti nel file db.json
