cd ..
cd ./Network

./new-network.sh down

docker ps -a

cd ..
cd ./onoff

pm2 stop all
pm2 delete all



echo "success"
