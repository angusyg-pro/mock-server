FROM nodejs

# Arguments du build
ARG GIT_REPOSITORY

# Ajout des variables d'environnement
ENV NODE_APP_SRC /usr/src/nodejs
ENV PORT 3000

# Création du dossier de l'application node
WORKDIR ${NODE_APP_SRC}

# Récupération des sources du projet
RUN git -c http.sslVerify=false clone ${GIT_REPOSITORY} ${NODE_APP_SRC}

# Dossier de l'application
WORKDIR ${NODE_APP_SRC}/app

# Proxy pour NPM
RUN npm config set proxy=${http_proxy} && npm config set https-proxy=${https_proxy} && npm config set strict-ssl=false

# Installation de l'application, build et clean des dépendances de dev
RUN npm install
RUN npm run build
RUN npm prune --production

# Supprime le proxy npm
RUN npm config rm proxy && npm config rm https-proxy

# Expose le port de l'application node
EXPOSE ${PORT}

# Monitore l'application node avec pm2
CMD ["pm2-runtime", "--json", "start", "ecosystem.config.js", "--env", "production"]
