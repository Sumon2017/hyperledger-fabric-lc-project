
'use strict';

const { Contract } = require('fabric-contract-api');
const { ClientIdentity } =require('fabric-shim');
const path = require('path');
const verify = require(path.join(__dirname,'verify'));
const getHash = require(path.join(__dirname,'get-hash'));

class LCChainCode extends Contract {

    async InitLedger(ctx) {
        const assets = [
            // {
            //     lc_id:'',
            //     buyers_id:'',
            //     sellers_id:'',
            //     carrier_org_id:'',
            //     ammount:'',
            //     product_details_obj:'',
            //     expire_time:'',
            //     buyers_public_key:'',
            //     sellers_public_key:'',
            //     buyers_sign:'',
            //     sellers_sign:'',
            //     lc_status:'',
            //     shipment_details_obj:'',
            //     transaction_details:'',
            // },
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.lc_id, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.lc_id} initialized`);
        }
    }
    

    async CreateLC(ctx,buyers_id,sellers_id,carrier_org_id,ammount,product_details_obj,expire_time,sellers_public_key,sellers_sign) {

        const now = new Date();
        if( Date.parse( now.toLocaleString() ) > Date.parse( expire_time.toLocaleString() ) ){
            return JSON.stringify({
                msg:'enter a valid expire time',
                value:{}
            });
        }

        let cid = await new ClientIdentity(ctx.stub);
        let mspid = await cid.getMSPID();
        if(mspid != 'Org2MSP'){
            return JSON.stringify({
                msg:'this method is only for seller\'s org (Org2)',
                value:{}
            });
        }

        let lc={
            lc_id:'',
            buyers_id:buyers_id,
            sellers_id:sellers_id,
            carrier_org_id:carrier_org_id,
            ammount:ammount,
            product_details_obj:product_details_obj,
            expire_time:expire_time,
            buyers_public_key:'',
            sellers_public_key:sellers_public_key,
            buyers_sign:'',
            sellers_sign:sellers_sign,
            lc_status:'initial',
            shipment_details_obj:'',
            transaction_details:'',
        };

        const product_details_hash= await getHash(JSON.stringify(product_details_obj));
        const sz=product_details_hash.length;
        lc.lc_id = product_details_hash.slice(sz-8,sz);

        const flag = await this.AssetExists(ctx,lc.lc_id);
        if(flag){
            return JSON.stringify({
                msg:'Error.. try again , slightly changing the product details ',
                value:{}
            });
        }


        await ctx.stub.putState(lc.lc_id, Buffer.from(JSON.stringify(lc)));
        
        return JSON.stringify({
            msg:'success',
            value:lc
        });

    }


    //////////////
    //////////////

    async BuyersVerify(ctx,lc_id,buyers_public_key,buyers_sign){

        let cid = await new ClientIdentity(ctx.stub);
        let mspid = await cid.getMSPID();
        if(mspid != 'Org1MSP'){
            return JSON.stringify({
                msg:'this method is only for buyer\'s org (Org1)',
                value:{}
            });
        }

        const flag = await this.AssetExists(ctx,lc_id);
        if(!flag){
            return JSON.stringify({
                msg:'no lc exists with this id',
                value:{}
            });
        }

        let assetStr = await this.ReadAsset(ctx,lc_id);
        let lc = JSON.parse(assetStr);
        lc.buyers_public_key=buyers_public_key;
        lc.buyers_sign=buyers_sign;

        if(lc.lc_status !='initial'){
            return JSON.stringify({
                msg:'can\'t use this method at this point',
                value:{}
            });
        }

        const result = await verify({
            buyers_id:lc.buyers_id,
            sellers_id:lc.sellers_id,
            carrier_org_id:lc.carrier_org_id,
            ammount:lc.ammount,
            product_details_obj:lc.product_details_obj,
            expire_time:lc.expire_time,
        },lc.sellers_public_key,lc.sellers_sign);

        if(result){
            lc.lc_status='approved';
            await ctx.stub.putState(lc.lc_id, Buffer.from(JSON.stringify(lc)));
            return JSON.stringify({
                msg:'success',
                value:lc
            });
        }
        else{
            return JSON.stringify({
                msg:'seller didn\'t sign it',
                value:{}
            });
        }
    }


    async BuyersBankVerify(ctx,lc_id){

        let cid = await new ClientIdentity(ctx.stub);
        let mspid = await cid.getMSPID();
        if(mspid != 'Org3MSP'){
            return JSON.stringify({
                msg:'this method is only for buyer\'s bank org (Org3)',
                value:{}
            });
        }


        const flag = await this.AssetExists(ctx,lc_id);
        if(!flag){
            return JSON.stringify({
                msg:'no lc exists with this id',
                value:{}
            });
        }

        let assetStr = await this.ReadAsset(ctx,lc_id);
        let lc = JSON.parse(assetStr);

        if(lc.lc_status !='approved'){
            return JSON.stringify({
                msg:'can\'t use this method at this point',
                value:{}
            });
        }
        
        const now = new Date();
        if( Date.parse( now.toLocaleString() ) > Date.parse( lc.expire_time.toLocaleString() ) ){
            return JSON.stringify({
                msg:'time expired',
                value:{}
            });
        }

        const result_S = await verify({
            buyers_id:lc.buyers_id,
            sellers_id:lc.sellers_id,
            carrier_org_id:lc.carrier_org_id,
            ammount:lc.ammount,
            product_details_obj:lc.product_details_obj,
            expire_time:lc.expire_time,
        },lc.sellers_public_key,lc.sellers_sign);

        const result_B = await verify({
            buyers_id:lc.buyers_id,
            sellers_id:lc.sellers_id,
            carrier_org_id:lc.carrier_org_id,
            ammount:lc.ammount,
            product_details_obj:lc.product_details_obj,
            expire_time:lc.expire_time,
        },lc.buyers_public_key,lc.buyers_sign);


        if(result_B && result_S){
            lc.lc_status='issued';
        }
        else{
            lc.lc_status='failed';
        }

        await ctx.stub.putState(lc.lc_id, Buffer.from(JSON.stringify(lc)));


        if(lc.lc_status == 'failed'){
            return JSON.stringify({
                msg:'failed',
                value:{}
            });
        }
        else{
            return JSON.stringify({
                msg:'success',
                value:lc
            });
        }
    }

    async SellersBankShipmentObj(ctx,lc_id,shipment_details_obj){

        let cid = await new ClientIdentity(ctx.stub);
        let mspid = await cid.getMSPID();
        if(mspid != 'Org4MSP'){
            return JSON.stringify({
                msg:'this method is only for seller\'s bank org (Org4)',
                value:{}
            });
        }

        const flag = await this.AssetExists(ctx,lc_id);
        if(!flag){
            return JSON.stringify({
                msg:'no lc exists with this id',
                value:{}
            });
        }

        let assetStr = await this.ReadAsset(ctx,lc_id);
        let lc = JSON.parse(assetStr);

        if(lc.lc_status != 'issued'){
            return JSON.stringify({
                msg:'can\'t use this method at this point',
                value:{}
            });
        }

        lc.shipment_details_obj=shipment_details_obj;
        lc.lc_status='shipped';
        await ctx.stub.putState(lc.lc_id, Buffer.from(JSON.stringify(lc)));

        return JSON.stringify({
            msg:'success',
            value:lc
        });

    }

    async BuyersBankTransaction(ctx,lc_id,transaction_details){

        let cid = await new ClientIdentity(ctx.stub);
        let mspid = await cid.getMSPID();
        if(mspid != 'Org3MSP'){
            return JSON.stringify({
                msg:'this method is only for buyer\'s bank org (Org3)',
                value:{}
            });
        }

        const flag = await this.AssetExists(ctx,lc_id);
        if(!flag){
            return JSON.stringify({
                msg:'no lc exists with this id',
                value:{}
            });
        }

        let assetStr = await this.ReadAsset(ctx,lc_id);
        let lc = JSON.parse(assetStr);

        if(lc.lc_status != 'shipped'){
            return JSON.stringify({
                msg:'can\'t use this method at this point',
                value:{}
            });
        }

        lc.transaction_details=transaction_details;
        lc.lc_status='all_done';
        await ctx.stub.putState(lc.lc_id, Buffer.from(JSON.stringify(lc)));

        return JSON.stringify({
            msg:'success',
            value:lc
        });

    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }


    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state.
    async TransferAsset(ctx, id, newOwner) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.Owner = newOwner;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }

    // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }


    async GetAllAssetsBuyers(ctx,username) {

        let cid = await new ClientIdentity(ctx.stub);
        let mspid = await cid.getMSPID();
        if(mspid != 'Org1MSP'){
            return JSON.stringify({
                msg:'this method is only for buyer\'s org (Org1)',
                value:{}
            });
        }

        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }

        const newAllResults = allResults.filter((thing)=>{
            return thing.buyers_id == username ;
        });

        return JSON.stringify(newAllResults);
    }


    async GetAllAssetsSellers(ctx,username) {

        let cid = await new ClientIdentity(ctx.stub);
        let mspid = await cid.getMSPID();
        if(mspid != 'Org2MSP'){
            return JSON.stringify({
                msg:'this method is only for seller\'s org (Org2)',
                value:{}
            });
        }

        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }

        const newAllResults = allResults.filter((thing)=>{
            return thing.sellers_id == username ;
        });

        return JSON.stringify(newAllResults);
    }


}

module.exports = LCChainCode;
