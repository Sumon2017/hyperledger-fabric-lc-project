cd ..
cd ./Network
./new-network.sh up -ca -s couchdb
./scripts/new-createChannel-5.sh lcchannelcore
./scripts/new-deployCC.sh lcchannelcore lccontract ../Chaincode/ javascript


cd ..
cd ./onoff




LC_PROJECT_TO_SERVERS=".."

rm ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersOrgApp/credentials/sk
rm ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersOrgApp/credentials/cert.pem
rm ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersOrgApp/credentials/connection-org1.json
rm ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersOrgApp/wallets/ourserver1.id

rm ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersOrgApp/credentials/sk
rm ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersOrgApp/credentials/cert.pem
rm ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersOrgApp/credentials/connection-org2.json
rm ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersOrgApp/wallets/ourserver2.id

rm ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersBank/credentials/sk
rm ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersBank/credentials/cert.pem
rm ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersBank/credentials/connection-org3.json
rm ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersBank/wallets/ourserver3.id

rm ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersBank/credentials/sk
rm ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersBank/credentials/cert.pem
rm ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersBank/credentials/connection-org4.json
rm ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersBank/wallets/ourserver4.id

cp ${PWD}/../Network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/* ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersOrgApp/credentials/
LC_PROJECT_KEY_NAME=$(ls ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersOrgApp/credentials/)
mv ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersOrgApp/credentials/${LC_PROJECT_KEY_NAME} ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersOrgApp/credentials/sk
cp ${PWD}/../Network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/cert.pem ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersOrgApp/credentials/cert.pem
cp ${PWD}/../Network/organizations/peerOrganizations/org1.example.com/connection-org1.json ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersOrgApp/credentials/connection-org1.json



cp ${PWD}/../Network/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/keystore/* ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersOrgApp/credentials/
LC_PROJECT_KEY_NAME=$(ls ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersOrgApp/credentials/)
mv ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersOrgApp/credentials/${LC_PROJECT_KEY_NAME} ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersOrgApp/credentials/sk
cp ${PWD}/../Network/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/signcerts/cert.pem ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersOrgApp/credentials/cert.pem
cp ${PWD}/../Network/organizations/peerOrganizations/org2.example.com/connection-org2.json ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersOrgApp/credentials/connection-org2.json



cp ${PWD}/../Network/organizations/peerOrganizations/org3.example.com/users/User1@org3.example.com/msp/keystore/* ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersBank/credentials/
LC_PROJECT_KEY_NAME=$(ls ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersBank/credentials/)
mv ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersBank/credentials/${LC_PROJECT_KEY_NAME} ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersBank/credentials/sk
cp ${PWD}/../Network/organizations/peerOrganizations/org3.example.com/users/User1@org3.example.com/msp/signcerts/cert.pem ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersBank/credentials/cert.pem
cp ${PWD}/../Network/organizations/peerOrganizations/org3.example.com/connection-org3.json ${PWD}/${LC_PROJECT_TO_SERVERS}/BuyersBank/credentials/connection-org3.json



cp ${PWD}/../Network/organizations/peerOrganizations/org4.example.com/users/User1@org4.example.com/msp/keystore/* ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersBank/credentials/
LC_PROJECT_KEY_NAME=$(ls ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersBank/credentials/)
mv ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersBank/credentials/${LC_PROJECT_KEY_NAME} ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersBank/credentials/sk
cp ${PWD}/../Network/organizations/peerOrganizations/org4.example.com/users/User1@org4.example.com/msp/signcerts/cert.pem ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersBank/credentials/cert.pem
cp ${PWD}/../Network/organizations/peerOrganizations/org4.example.com/connection-org4.json ${PWD}/${LC_PROJECT_TO_SERVERS}/SellersBank/credentials/connection-org4.json


cd ..
cd ./BuyersOrgApp
npm install
pm2 start index.js --name bo


cd ..
cd ./SellersOrgApp
npm install
pm2 start index.js --name so

cd ..
cd ./BuyersBank
npm install
pm2 start index.js --name bb

cd ..
cd ./SellersBank
npm install
pm2 start index.js --name sb

cd ..
cd ./UtillApp
npm install
pm2 start index.js --name utill

cd ..
cd ./onoff

echo "success"
