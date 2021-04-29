cd ..
cd ./Network

./new-network.sh down

docker ps -a

cd ..
cd ./onoff


pm2 stop bo
pm2 stop so
pm2 stop bb
pm2 stop sb


pm2 delete bo
pm2 delete so
pm2 delete bb
pm2 delete sb


# pm2 stop all
# pm2 delete all



echo "success"
