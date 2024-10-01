@echo off

echo ---------------------------------------
echo       Building Client and Server   
echo ---------------------------------------

cd client
call npm install
call npm run build


cd ..
cd server
call npm install
call npm run build

echo finished building client and server

pause