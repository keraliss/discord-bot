export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.5.0/bin

git clone https://github.com/Bitshala/discord-bot.git
cd discord-bot
git pull origin main
tsc
pm2 kill
pm2 start dist/index.js