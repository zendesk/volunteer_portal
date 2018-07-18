FROM ruby:2.5

# Install Node 8
RUN apt-get update && \
    apt-get install -y \
            build-essential \
            zlib1g-dev wget apt-transport-https && \
    wget -qO- https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    echo 'deb https://deb.nodesource.com/node_8.x trusty main' > /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -y nodejs && \
    apt-get clean

RUN mkdir /app
WORKDIR /app

# Budle install
COPY Gemfile* .ruby-version /app/
RUN bundle install --jobs 4 || bundle check

# Node install
COPY package*.json ./
RUN npm install

COPY . /app

EXPOSE 5000
EXPOSE 8080

CMD [ "bundle", "exec", "foreman", "start" ]
