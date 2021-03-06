# Serveur de mocks

## Vérification des paramètres d'environnement

Vérifier dans le fichier *app/ecosystem.config.js* que tous les paramètres sont corrects pour l'environnnement cible (port, url, url de la base de données ...) et les modifier si besoin.

## Création de l'image Docker

Se placer à la racine du dépôt et faire la commande suivante en remplaçant les variables:
* PROXY_URL: URL du proxy pour connexion de npm au repository externe lors de l'installation (http://PBXXXX:PASSWORD@proxynav:8080).
* VERSION: Numéro de version de l'image.
* GIT_REPOSITORY_URL: URL du repository git avec les sources de l'application.

~~~~
sudo docker build --network host --build-arg https_proxy=PROXY_URL --build-arg http_proxy=PROXY_URL --build-arg GIT_REPOSITORY=GIT_REPOSITORY_URL -t mock-server:latest -t mock-server:VERSION .
~~~~

La commande va alors créer une image Docker disponible avec 2 tags.

## Démarrage d'un container avec Docker-compose

Vérifier que les paramètres dans le fichier *docker-compose.yml* à la racine sont corrects:
* Le nom du container.
* Le nom de l'image à utiliser.
* Le port par défaut de l'application dans le container est 3000.
* Il faut modifier si besoin le port de la machine host.

Exécuter la commande suivante dans le dossier pour démarrer le container en mode deamon:
~~~~
sudo docker-compose up -d
~~~~

## Arrêt d'un container avec Docker-compose

Dans le dossier contenant le fichier *docker-compose.yml* exécuter la commande:
~~~~
sudo docker-compose down
~~~~

Cette commande arrête le container et supprime le container arrêté.