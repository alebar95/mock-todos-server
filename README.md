# mock-todos-server

JSON server dell'app todo-app.

Installare Docker sulla propria macchina se non presente.

Clonare il progetto, portarsi nella root del progetto e lanciare il comando:

docker build . -t mock-todos-server

Una volta creata l'immagine, eseguirla in un container con il comando:

docker run -d -p 3000:3000 --name mock-todos-server mock-todos-server
