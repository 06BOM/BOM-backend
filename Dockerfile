FROM node:16-alpine
MAINTAINER Chaejin Lim <icj0103@ajou.ac.kr>

# Create /app directory
RUN mkdir -p /app
# Configure /app directory as a WORKDIR
WORKDIR /app
# Copy all files in the current path to the /app directory
ADD . /app
# Execute npm install
RUN npm install

# Port that we're gonna open
EXPOSE 3000

# The command that we're gonna execute
CMD ["npm", "start"]