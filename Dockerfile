# Étape 1 : Utiliser une image Node.js comme base
FROM node:16-alpine AS development

# Déclarer l'environnement de développement
ENV NODE_ENV development

# Définir le répertoire de travail
WORKDIR /react-app

# Copier uniquement le fichier package.json et package-lock.json pour installer les dépendances
COPY ./package*.json /react-app/

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port par défaut utilisé par Vite
EXPOSE 5173

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]
