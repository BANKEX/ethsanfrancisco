## About
We believe that UI/UX friendly solution can change the way how people will use cryptocurrencies. We are trying to make new ways to show user a process of making their private keys (in UX way,  not making our own cryptography of course). We spent a lot of time in Universities where we have a course for students (Soldity and Web3). So, we spent a lot of time explaining people how works digital signature, how to send transactions and e.t.c. 

We think that the main UI/UX issue for Ethereum and other project is holding private keys and sign transactions. - It's not intuitive and we can't make it on backend because it's not decentralized and trustable.

So, we decided to make a protocol that will allow to sign and hold keys in a convenient way. - It will be a QR code encrypted by user's password. 

#Why QR?

1. User know where all the money are (for people who don't know crypto it's really hard to explain private key system) 
2. User can share it between devices easily  (it's encrypted with a strong password, so it's really hard to brute force it)
3. There are not only one private key there (One QR code - a lot of private key for BTC, ETH and e.t.c)

## Who we are

We are BANKEX Foundation company developers with background at fullstack / solidity.

## Project structure

# Facebook folder

Сontains code of Facebook Messanger bot.

```
docker build --rm -f Dockerfile -t facebot:latest ./

docker run --rm -d -p 5000:5000 --env-file=config/dev.env --name facebot facebot:latest

docker logs facebot
```

# API folder

Contains code of backend server.

# View folder

Contains static pages.

# Telegram folder

Contains code of Telegram bot

## Building & Launching

```
docker swarm init

docker stack deploy -c build.yaml bot
```
